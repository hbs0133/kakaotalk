/**
 * @author asoocool
 */

QueryManager = class QueryManager
{
    constructor(name)
    {
        this.name = name;			//매니저를 구분 짓는 이름
        this.netIo = null;			//io 전송 방식에 따른 객체 저장
        
        this.sndBuf = null;			//전송용 ABuffer 객체
        this.rcvBuf = null;			//수신용 ABuffer 객체
        this.queryListeners = [];	//IO 이벤트를 수신할 객체들을 모아둔 배열
        this.realComps = {};		//리얼 데이터를 수신할 컴포넌트 모음

        //초기화	
        this.headerInfo = null;
        this.setHeaderInfo();
        
        this.errorData = 
        {
            trName: '',
            errCode: '',	//메시지코드/오류코드
            errMsg: ''		//에러 메시지
        };

        //수신 패킷 정보
        this.packetInfo = 
        {
            packetType: 0,
            packetId: 0, 
            menuNo: '', 
            groupName: '', 
            trName: ''
        };
        
        //전송 패킷 정보
        this.sendInfo = 
        {
            packetType: 0,
            packetId: 0, 
            menuNo: '', 
            groupName: '', 
            trName: ''
        };
        
        
        this.publicKey = null;
        this.sessionKey = null;
        
        this.packetId = 0;
        
        this.isShowProgress = true;
        this.isVisibleUpdate = true;	//보여질 경우만 데이터를 업데이트를 하는 옵션
        this.timeoutSec = 15; //zero is unlimit
        
        this.errCodeMap = {};
        this.queryCallbacks = {};
        this.realProcMap = {};
    }

}

QueryManager.prototype.startManager = function(address, port)
{
	if(this.netIo) this.netIo.startIO(address, port);
};

QueryManager.prototype.stopManager = function()
{
	if(this.netIo) this.netIo.stopIO();
};

QueryManager.prototype.setNetworkIo = function(netIo)
{
	this.netIo = netIo;
};

QueryManager.prototype.setQueryCallback = function(key, callback)
{
	this.queryCallbacks[key] = callback;
};

QueryManager.prototype.getQueryCallback = function(key)
{
	var callback = this.queryCallbacks[key];
	if(callback) 
	{
		if(callback.timeout) 
		{
			clearTimeout(callback.timeout);
			callback.timeout = null;
		}
	
		if(!callback.noDelete) delete this.queryCallbacks[key];
	}
	
	return callback;
};

QueryManager.prototype.clearAllQueryCallback = function()
{
	var callback, key;
	for(key in this.queryCallbacks)
	{
		callback = this.queryCallbacks[key];
		
		if(callback.timeout) 
		{
			clearTimeout(callback.timeout);
			callback.timeout = null;
		}
	}

	this.queryCallbacks = {};
};

QueryManager.prototype.clearAllRealComps = function()
{
	this.realComps = {};
};

QueryManager.prototype.setQueryBuffer = function(sendSize, recvSize, charSet, emptyChar, emptyNumChar)
{
	this.sndBuf = new ABuffer(sendSize);
	this.sndBuf.setCharset(charSet);
	
	this.rcvBuf = new ABuffer(recvSize);
	this.rcvBuf.setCharset(charSet);
	
	if(emptyChar!=undefined && emptyChar!=null)  
	{
		this.sndBuf.setEmptyChar(emptyChar);
		this.rcvBuf.setEmptyChar(emptyChar);
	}
	
	if(emptyNumChar!=undefined && emptyNumChar!=null) 
	{
		this.sndBuf.setEmptyNumChar(emptyNumChar);
		this.rcvBuf.setEmptyNumChar(emptyNumChar);
	}
};

QueryManager.prototype.showProgress = function(isShow)
{
	this.isShowProgress = isShow;
};


//second
QueryManager.prototype.setTimeout = function(timeoutSec)
{
	this.timeoutSec = timeoutSec;
};

QueryManager.prototype.getLastError = function(key)
{
	if(key) return this.errorData[key];
	else return this.errorData;
};

QueryManager.prototype.getLastPacketInfo = function(key)
{
	if(key) return this.packetInfo[key];
	else return this.packetInfo;
};

QueryManager.prototype.printLastError = function(key)
{
	if(key) return afc.log(key + ':' + this.errorData[key]);
	else return afc.log(JSON.stringify(this.errorData, undefined, 2));
};

//---------------------------------------------------------
//	listener functions
//	function afterRecvBufferData(QueryManager);				* 수신버퍼에 데이터를 수신한 후 바로 호출된다.
//	function afterOutBlockData(queryData, QueryManager);	* 수신된 데이터를 AQueryData 에 채운 후 호출된다.
//	function beforeInBlockBuffer(queryData, groupName);		* 전송버퍼에 데이터를 채우기 전에 호출된다.
//	function beforeSendBufferData(QueryManager);			* 전송버퍼의 데이터를 전송하기 바로 전에 호출된다.

//화면 아이디  기준
QueryManager.prototype.addQueryListener = function(listener)//function(name, listener)
{
	for(var i=0; i<this.queryListeners.length; i++)
		if(this.queryListeners[i]===listener) return;
	
	this.queryListeners.push(listener);
};

QueryManager.prototype.removeQueryListener = function(listener)//function(name)
{
	for(var i=0; i<this.queryListeners.length; i++)
	{
		if(this.queryListeners[i]===listener)
		{
			this.queryListeners.splice(i, 1);
			return;
		}
	}
	
};

//리얼 수신용 컴포넌트 등록
QueryManager.prototype.addRealComp = function(dataKey, comp)
{
	var array = this.realComps[dataKey];
	if(!array) array = this.realComps[dataKey] = [];
	
	for(var i=0; i<array.length; i++)
	{
		if(array[i]===comp) return -1;
	}
	
	//if(!comp.realDataKeyArr) comp.realDataKeyArr = [];
	
	//자신이 속한 리얼에 대한 dataKey 값들을 저장해 둔다.
	//comp.realDataKeyArr.push(dataKey);
	
	array.push(comp);
	return array.length;
};

QueryManager.prototype.removeRealComp = function(dataKey, comp)
{
	var array = this.realComps[dataKey];
	if(!array) return -1;
	
	for(var i=0; i<array.length; i++)
	{
		if(array[i]===comp)
		{
			/*
			//리얼에 대한 dataKey remove
			for(var j=0; j<comp.realDataKeyArr.length; j++)
			{
				if(comp.realDataKeyArr[j]==dataKey)
				{
					comp.realDataKeyArr.splice(j, 1);
					break;
				}
			}
			*/
			
			array.splice(i, 1);
			if(array.length==0) delete this.realComps[dataKey];
			
			return array.length;
		}
	}
	
	return -1;
};

//return : array
QueryManager.prototype.getRealComps = function(dataKey)
{
	return this.realComps[dataKey];
};

//keyArr = [ KR004LTC__USD__, KR004LTC__USD__,  ... ], 
//이것은 서버에게, 설정한 키값과 관련된 값이 변경되면 리얼을 전송해 달라고 요청하기 위한 값이다.
//서버에서는 키값과 관련되어져 있는 값이 변경되면 리얼을 내려준다. 사용하지 않으면 [''], realDataToComp 호출 시 key 값을 '' 로 넣어줌.
//compArr = [acomp, acomp, ...]
//updateTypes : updateType or [updateType, updateType, ... ] (updateType: -1/prepend, 0/update, 1/append)
QueryManager.prototype.registerReal = async function(aquery, realField, keyArr, compArr, updateTypes, callback, afterUpdate)
{
	var i, j, regArr = [], comp, dataKey;
		
	if(typeof(aquery)=='string') aquery = await AQuery.getSafeQuery(aquery);
	
	//문자열이면 컨테이너 아이디가 들어오고 
	//현재 컨테이너에서 aquery(리얼TR) 로 매핑되어져 있는 모든 컴포넌트를 얻어서 등록한다.
	if(typeof(compArr)=='string') compArr = aquery.getQueryComps(compArr, 'output');
	
	if(!compArr) return;

	for(i=0; i<keyArr.length; i++)
	{
		dataKey = aquery.getName() + keyArr[i];
		
		for(j=0; j<compArr.length; j++)
		{
			//특정 키에 대해 등록되어져 있는 컴포넌트 개수를 리턴. 즉, 최초로 등록하는 경우만 전송 정보로 셋팅한다.
			if(this.addRealComp(dataKey, compArr[j]) == 1)
			{
				regArr.push(keyArr[i]);
			}
		}

		if(callback || afterUpdate)
		{
			//같은 키로 여러 컴포넌트에 realCallback 함수를 셋팅하면 리얼 수신시 
			//같은 callback 함수가 여러번 호출되므로 첫번째 컴포넌트에만 함수를 셋팅한다.

			if(compArr.length>0)
			{
				comp = compArr[0];

				if(!comp.realCallbacks) comp.realCallbacks = {};

				comp.realCallbacks[dataKey] = { cb: callback, au: afterUpdate };
			}
		}
	}
	
	//var comp, block = aquery.getQueryBlock('input', 'InBlock1'),
	//	realKey = block.format[0][AQuery.IKEY];
	
	//asoocool 2019/4/19
	//복수의 realType 을 지정하기 위해 AQuery 쪽으로 옮김
	//기존 코드도 작동하도록 함. 차후에 제거

	var realType = aquery.getRealType(), updateType;
	if(realType!=undefined) updateTypes = realType;
	if(!updateTypes) updateTypes = 0;
	
	if(typeof(updateTypes) != 'object') updateTypes = new Array(compArr.length).fill(updateTypes);
	if(updateTypes.length != compArr.length) throw new Error('Different length of updateTypes and compArr');

	//set updateType to component
	for(j=0; j<compArr.length; j++)
	{
		comp = compArr[j];
		updateType = updateTypes[j];
		comp.setUpdateType(updateType);

		if(updateType==0 || updateType==2) 
		{
			//comp.updateType = 0;

			// setRealMap을 직접 호출하고 나중에 리얼을 등록하고 싶은 경우를 위해 수정
			// 1. setRealMap(realField)
			// 2. 조회1 수신후 조회2 호출 .... 조회N-1 수신후 조회N 호출
			// 3. 조회N 수신 후 리얼등록(realField값 null로 세팅)
			if(comp.setRealMap && realField) comp.setRealMap(realField);	//그리드 같은 컴포넌트는 realMap 이 존재한다.
		}
		//else comp.updateType = updateType;
	}
	
	
	//새롭게 등록할 정보가 있으면
	if(regArr.length>0)
		this.sendRealSet(aquery, true, regArr);
};

QueryManager.prototype.unregisterReal = async function(aquery, keyArr, compArr)
{
	var i, j, regArr = [], comp, dataKey;
	
	if(typeof(aquery)=='string') aquery = AQuery.getQuery(aquery);
	
	//문자열이면 컨테이너 아이디가 들어오고 매핑되어져 있는 컴포넌트를 얻어서 등록한다.
	if(typeof(compArr)=='string') compArr = await aquery.getQueryComps(compArr, 'output');
	
	if(!compArr) return;
	
	for(i=0; i<keyArr.length; i++)
	{
		dataKey = aquery.getName() + keyArr[i];
	
		for(j=0; j<compArr.length; j++)
		{
			comp = compArr[j];

			//특정 키에 대해 모든 컴포넌트의 등록이 해제되면 전송 정보로 셋팅한다.
			if(this.removeRealComp(dataKey, comp) == 0)
			{
				regArr.push(keyArr[i]);
			}

			//파람으로 넘어온 compArr 의 순서가 reg 시점과 똑같다고 보장할 수 없으므로, 모든 컴포넌트의 realCallback 변수를 삭제한다.
			if(comp.realCallbacks) 
			{
				delete comp.realCallbacks[dataKey];

				if(Object.keys(comp.realCallbacks).length==0) comp.realCallbacks = undefined;
			}
		}
	}
	
	//set updateType to component
	for(j=0; j<compArr.length; j++)
	{
		comp = compArr[j];
		comp.updateType = undefined;

		if(comp.setRealMap) comp.setRealMap(null);
	}
	
	//새롭게 해제할 정보가 있으면
	if(regArr.length>0)
		this.sendRealSet(aquery, false, regArr);
};

QueryManager.prototype.getHeaderInfo = function(headerKey)
{
	if(headerKey) return this.headerInfo[headerKey];
	else return this.headerInfo;
};

QueryManager.prototype.setHeaderInfo = function(headerInfo)
{
	if(headerInfo)
	{
		for(var p in headerInfo)
		{
			if(!headerInfo.hasOwnProperty(p)) continue;
			this.headerInfo[p] = headerInfo[p];
		}
	}
	//파라미터가 null 인 경우 초기화
	else
	{
		this.headerInfo = 
		{
			PBLC_IP_ADDR		: '',	// 공인 IP		//10.110.51.182
			PRVT_IP_ADDR		: '',	// 사설 IP		//10.110.51.182
			MAC_ADR				: '',	// Mac 주소		//6C626D3A60C9
			TMNL_OS_TCD			: 'PC',	// 단말 OS 구분 코드 MS Win:"PC" MAC:"MC" AND:"AP" IPHONE:"IP" IPAD:"ID" AND PAD:"AD" 기타:"ZZ"
			TMNL_OS_VER			: '',	// 단말 OS 버전
			TMNL_BROW_TCD		: '',	// 단말 브라우저 구분 코드 익스플로러:"IE" 사파리:"SF" 파이어폭스:"FX" 크롬:"CR" 오페라:"OP" WEBKIT:"WK" 기타:"ZZ"
			TMNL_BROW_VER		: ''	// 단말 브라우저 버전
		};
	}
};

QueryManager.prototype.onConnected = function(success)
{
	//afc.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ QueryManager.prototype.onConnected');
};

QueryManager.prototype.onClosed = function()
{
	//afc.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ QueryManager.prototype.onClosed');
	this.clearAllQueryCallback();
	this.clearAllRealComps();
	
	// TODO: 재접속 처리 로직 
// 	if(!this.selfClose && !theApp.isPause)
// 		theApp.autoLoginProcess('재접속중입니다...');
};

//############################################################################################################################################
// 상속받아 오버라이드 해야하는 함수들


//상속 받아 다음과 같은 패턴으로 구현한다.
QueryManager.prototype.onReceived = function(data, size)
{
	//----------------------------------------------------
	
	//	1. this.rcvBuf 를 생성한다. 생성방법은 상황에 따라 다름.
	//	this.rcvBuf.setBuffer(data);
	//	this.rcvBuf.setDataSize(size);
	
	//	2. 패킷 타입과 패킷 아이디를 셋팅한다.
	//	this.packetInfo.packetType = this.rcvBuf.getByte(OS_COMM_CMD);
	//	this.packetInfo.packetId = this.rcvBuf.getByte(OS_COMM_ID);

	//	3. 패킷 타입에 따라 처리 함수를 분기한다.
	//	switch(this.packetInfo.packetType)
	//	{
	//		case 1: this.queryProcess(); break;
	//		case 2: this.realProcess(); break;
	//	}
	
	//----------------------------------------------------
};

//전송헤더 이후의 데이터 셋팅 오프셋을 리턴한다.
QueryManager.prototype.getInDataOffset = function(aquery, queryData)
{
	return 0;
};

//수신헤더 이후의 데이터 셋팅 오프셋을 리턴한다.
QueryManager.prototype.getOutDataOffset = function(aquery)
{
	return 0;
};

//리얼 헤더 이후의 데이터 셋팅 오프셋을 리턴한다.
QueryManager.prototype.getRealDataOffset = function(aquery)
{
	return 0;
};

//	리얼 전문의 queryName 을 얻어 리턴한다.
//	recvObj 는 json 형식 수신시 셋팅된다.
QueryManager.prototype.getRealQueryName = function()
{
	//ex)
	//	return this.rcvBuf.nextOriString(4);
	//	return this.recvObj.header.query_name;
	
	return '';
};

QueryManager.prototype.getRealKey = function(queryData)
{
	
	return '';
};



//사용할 AQueryData(또는 상속받은 클래스) 객체를 생성하여 리턴한다.
QueryManager.prototype.makeQueryData = function(aquery, isSend)
{
	return new AQueryData(aquery, this);
};

//리얼 등록/해제 패킷 전송 함수... 재정의 하기, unregisterReal 함수 내에서 호출함
QueryManager.prototype.sendRealSet = function(aquery, isSet, regArr)
{

};

//서버에 데이터를 송신하기 전에 호출되어 헤더 정보를 세팅한다.
QueryManager.prototype.makeHeader = function(queryData, abuf, menuNo)
{
	// abuf 객체의 메서드들을 이용하고 패킷아이디를 리턴한다.
	return this.makePacketId();
};

// 데이터 수신시 에러정보를 세팅하는 함수
QueryManager.prototype.setErrorData = function()
{
	//----------------------------------------------------
	
	//	* rcvBuf에서 에러데이터에 해당하는 정보를 뽑아 저장한다.
	//	this.errorData.errCode = this.rcvBuf.getString(OS_ERR_CODE, SZ_ERR_CODE);
	//	this.errorData.errMsg = this.rcvBuf.getString(OS_ERR_MSG, SZ_ERR_MSG);
	//		...
	//		etc
	//----------------------------------------------------
};

// 타임아웃시 에러정보를 세팅하는 함수
QueryManager.prototype.setTimeoutErrorData = function(trName, menuNo, groupName)
{
	// 파라미터로 넘어온 값을 사용하거나 원하는 코드 및 메시지로 표현한다.
	this.errorData.trName = trName;
	this.errorData.errCode = 10001;
	this.errorData.errMsg = '통신 상태가 원활하지 않습니다. : ' + trName + ',' + menuNo + ',' + groupName;
	//this.errorData.errMsg = '서버와의 접속이 지연되고 있습니다.';
};

//타입에 따라 전송을 다르게 처리하는 함수
//비동기 처리 이후 전송해야하는 경우 상속받아 전송전 비동기처리 후 자체 전송한다.
QueryManager.prototype.sendByType = function(obj)
{
	if(this.netIo.sorimachiSend)
	{
		obj.sendLen = obj.sndBuf.getDataSize();
		this.netIo.sorimachiSend(obj);
	}
	else if(obj.sndBuf) this.sendBufferData( obj.sndBuf.subDataArray() );
	else this.sendBufferData(JSON.stringify(obj.sendObj));
	
// 	----------------------------------------------------
	
// 	비동기 처리를 하는 경우 전송버퍼에 들어있는 데이터가 달라지므로 따로 저장해놓는다.
// 	var buf = obj.sndBuf;
// 	var sndArr = buf.subDataArray();
// 	if(obj.queryData.isSign())
// 	{
// 		var thisObj = this;
// 		var signOffset = OS_DATA; 
// 		var signData = buf.getString(signOffset, obj.packetSize - signOffset);
// 		var certData = theApp.getChiperData(theApp.certCiperKey);
// 		NativeSign(theApp.cert_DN, certData[0], certData[1], signData, function(sign)
// 		{
// 			비동기처리이후에 데이터를 가공하여 전송한다.
//
// 			buf.copyBuffer(sndArr, 0);
// 			buf.setOriString(sndArr.length, sign.length, sign);
// 			obj.packetSize = buf.getOffset()-5;
// 			buf.setNumString(0, 5, obj.packetSize);
// 			buf.setDataSize(obj.packetSize);
// 			thisObj.sendBufferData( buf.subDataArray );//super.sendByType(obj);
// 		});
// 	}
// 	else this.sendBufferData( sndArr );//super.sendByType(obj);
	
// 	----------------------------------------------------

};


// 여기까지 
//############################################################################################################################################



//asoocool dblTostr
QueryManager.prototype.enableDTS = function()
{
	this.dblTostr = true;
};

//	onReceive 함수 내에서 패킷 타입에 따라 분기하여 호출되는 함수
//	recvObj 는 json 형식 수신시 셋팅된다.
QueryManager.prototype.realProcess = function(recvObj)
{
	//----------------------------------------------------
	
	//	1. 쿼리 네임을 얻어 queryData 를 생성한다.
	//	var qryName = this.rcvBuf.nextOriString(4),
	//		aquery = AQuery.getQuery(qryName),
	//		queryData = this.makeQueryData(aquery);
	
	//	2. queryData 객체에 값을 채우고 dataKey 값을 구한 후
	//	queryData.outBlockData(this.rcvBuf, offset);
		
	//	3. realDataToComp 함수를 호출한다.
	
	//----------------------------------------------------
	
	if(recvObj) this.recvObj = recvObj;	
	
	var qryName = this.getRealQueryName(),
		aquery = AQuery.getQuery(qryName), 
		queryData = null, realKey = '';
	
	if(recvObj)
	{
		queryData = this.makeQueryData(aquery);
		
		queryData.outBlockData(this.recvObj);
	}
	else //if(this.rcvBuf)
	{
		var dataSize = this.rcvBuf.getDataSize(),
			dataOffset = this.getRealDataOffset(aquery);
		
		//body data 가 있는 경우만
		if(dataSize>dataOffset)
		{
			queryData = this.makeQueryData(aquery);
			
			//queryData 객체에 전문데이터를 세팅
			queryData.outBlockData(this.rcvBuf, dataOffset);
		}
	}
	
	if(queryData) 
	{
		realKey = this.getRealKey(queryData);
		
		this.realDataToComp(realKey, queryData);
	}

};

//	전문 수신 후 프로세스
//	recvObj 는 json 형식 수신시 넘어온다.
QueryManager.prototype.queryProcess = async function(recvObj)
{
//##########################################	
	if(this.isShowProgress) AIndicator.hide();
//##########################################

	//var dataSize = this.rcvBuf.getDataSize(),
	//	cbObj = this.getQueryCallback(this.packetInfo.packetId);
	
	var cbObj = null, dataSize = 0, thisObj = this, cbRet;
	
	if(recvObj) this.recvObj = recvObj;
	else dataSize = this.rcvBuf.getDataSize();
	//else if(this.rcvBuf) dataSize = this.rcvBuf.getDataSize();
		
	cbObj = this.getQueryCallback(this.packetInfo.packetId);
	
	// 타임아웃 발생시 콜백객체를 제거하므로 체크
	if(!cbObj) return;

	//패킷 정보 셋팅
	this.packetInfo.menuNo = cbObj.menuNo;
	this.packetInfo.groupName = cbObj.groupName;
	this.packetInfo.trName = cbObj.trName;

	//에러 메시지 셋팅
	this.errorData.trName = cbObj.trName;
	this.errorData.errCode = '';
	this.errorData.errMsg = '';
	this.setErrorData(recvObj);
	

	//수신된 전문 로그 남기는 함수, 개발시에만 호출
	//this.recv_log_helper();
	
	var listener, i, qLen = this.queryListeners.length;

	//버퍼에 데이터를 수신한 후 바로 호출된다.
	//######## afterRecvBufferData
	for(i=0; i<qLen; i++)
	{
		listener = this.queryListeners[i];
		if(listener.afterRecvBufferData) listener.afterRecvBufferData(this);
	}
	//########

	var queryData = null,
		aquery = AQuery.getQuery(cbObj.trName);

	if(!aquery)
	{
		if(this.isShowProgress) AIndicator.hide();

		alert('onReceive : ' + cbObj.trName + ' query is not found.');
		return;
	}
	
	if(recvObj)
	{
		queryData = this.makeQueryData(aquery);
		
		//outBlockData return false 인 경우 queryData null 처리
		if(queryData.outBlockData(recvObj) == false)
		{
			queryData = null;
		}
	}
	else //if(this.rcvBuf)
	{
		var dataOffset = this.getOutDataOffset(aquery);

		//body data 가 있는 경우만
		if(dataSize>dataOffset)
		{
			queryData = this.makeQueryData(aquery);

			//asoocool dblTostr
			queryData.dblTostr = cbObj.dblTostr;

			//queryData 객체에 전문데이터를 세팅
			queryData.outBlockData(this.rcvBuf, dataOffset);
		}
	}
	

	//타임 아웃 이후에 패킷이 도착하거나 
	//계정계 지연 패킷이 올수 있으므로 콜백 객체가 없어도 계속 진행한다.
	//계정계 지연 패킷은 listener 의 afterOutBlockData 함수에서만 구현 가능한다.
	if(cbObj && cbObj.func) cbRet = await cbObj.func.call(this, queryData);

	//수신된 데이터를 AQueryData 에 채운 후 호출된다.
	//######## afterOutBlockData
	for(i=0; i<qLen; i++)
	{
		listener = this.queryListeners[i];
		if(listener.afterOutBlockData) listener.afterOutBlockData(queryData, this);
	}
	//########

	if(queryData && (cbRet != false))
	{
		//afterOutBlockData 함수에서 AQueryData 의 enableLazyUpdate 함수를 호출하면 화면 업데이트를 비동기 함수 호출후에 할 수 있다.
		//차후 비동기 함수 콜백에서 queryData.lazyUpdate(); 함수를 호출해 준다.
		
		if(queryData.isLazyUpdate) queryData.lazyUpdate = _updateFunc;
		else _updateFunc();
	}
	
	//-----
	
	function _updateFunc()
	{
		var compArray = aquery.getQueryComps(cbObj.menuNo, 'output');
		
		if(compArray)
		{
			var qryComp, item;
			for(var i=0; i<compArray.length; i++)
			{
				qryComp = compArray[i];
				
				//asoocool, 컴포넌트 유효성 검사
				if(!qryComp.isValid()) continue;

				//비활성화된 탭은 적용되지 않도록
				//var tab = qryComp.getRootView().tab;
				//if(tab && $(tab.content).is(':hidden')) continue;
				
				if(thisObj.isVisibleUpdate)
				{
					//비활성화된 view 는 적용되지 않도록
					item = qryComp.getRootView()._item;
					//if(item && $(item).is(':hidden')) continue;
					if(item && item.style.display == 'none') continue;
				}

				//groupName 을 지정해 줬으면 같은 그룹네임인지 비교
				if( cbObj.groupName && cbObj.groupName!=qryComp.getGroupName() ) continue;

				qryComp.updateComponent(queryData);
			}
			
			if(cbObj && cbObj.ucfunc) cbObj.ucfunc.call(thisObj, queryData);
		}
	}
	
//##########################################	
	//if(this.isShowProgress) AIndicator.hide();
//##########################################
	
};

//option {
//	lazyQuerys: ['tr001', 'tr002'], 	//지정한 리얼 쿼리만 lazyUpdate 를 수행한다. 지정하지 않으면 전체
//	lazyComponents: [ comp1, comp2 ]	//지정한 컴포넌트만 lazyUpdate 를 수행한다.
//}
QueryManager.prototype.enableLazyUpdate = function(enable, option)
{
	if(enable) 
	{
		this.lazyQueryData = {};
		
		if(option)
		{
			if(option.lazyQuerys)
			{ 
				this.lazyQueryMap = {};

				for(var i=0; i<option.lazyQuerys.length; i++)
					this.lazyQueryMap[option.lazyQuerys[i]] = true;
			}

			if(option.lazyComponents)
			{
				this.lazyComponents = option.lazyComponents;
				
				this.lazyComponents.forEach(function(comp)
				{
					comp.isLazyUpdate = true;
				});
			}
		}
	}
	else 
	{
		this.lazyQueryData = null;
		this.lazyQueryMap = null;
		
		if(this.lazyComponents)
		{
			this.lazyComponents.forEach(function(comp)
			{
				comp.isLazyUpdate = undefined;
			});
			
			this.lazyComponents = null;
		}
	}
};

QueryManager.prototype.updateLazyData = function(disableAfterUpdate)
{
	if(this.lazyQueryData)
	{
		var arr, isLazyCompUpdate = Boolean(this.lazyComponents);
		
		for(var dataKey in this.lazyQueryData)
		{
			arr = this.lazyQueryData[dataKey];
			
			for(var i=0; i<arr.length; i++)
			{
				this._updateRealComps(dataKey, arr[i], isLazyCompUpdate);
			}
		}

		this.enableLazyUpdate(!disableAfterUpdate);
	}
};

//realProcess 함수에서 호출한다.
QueryManager.prototype.realDataToComp = function(key, queryData)
{
	var dataKey = queryData.getQueryName() + key;
	
	if(this.lazyQueryData)
	{
		//lazyQueryMap 을 지정하지 않았으면 쿼리 전체를 백업
		//지정한 경우는 지정된 쿼리만 백업
		if(!this.lazyQueryMap || this.lazyQueryMap[queryData.getQueryName()])
		{
			var arr = this.lazyQueryData[dataKey];

			if(!arr) 
			{
				this.lazyQueryData[dataKey] = arr = [];
			}

			var realType = queryData.getRealType();

			//update, realType==0 or realType==undefined
			if(!realType)
			{
				arr[0] = queryData;
			}
			else arr.push(queryData);
		
			//lazyComponents 를 지정했으면 업데이트 시점에 비교해야 하므로 
			//_updateRealComps 가 호출되도록 한다.
			if(!this.lazyComponents) return;
		}
	}
	
	return this._updateRealComps(dataKey, queryData, false);
};

//isLazyCompUpdate 값이 참이면 반대로 qryComp.isLazyUpdate 가 참인 경우 업데이트
//즉, 그동안 업데이트 안 됐던 컴포넌트만 업데이트 해준다.
QueryManager.prototype._updateRealComps = function(dataKey, queryData, isLazyCompUpdate)
{
	queryData.isReal = true;

	//dataKey 가 동일한 컴포넌트 들은 일단 모두 updateComponent 를 호출해 줘야 한다.(updateComponent 내부 주석 참조)
	var compArray = this.getRealComps(dataKey);
	if(compArray)
	{
		var qryComp, cbObj, item, cbRet;
		
		for(var i=0; i<compArray.length; i++)
		{
			qryComp = compArray[i];
			
			if(this.lazyComponents)
			{
				//lazyComp 로 등록된 컴포넌트는 스킵,
				//isLazyCompUpdate 값이 참이면 반대로 qryComp.isLazyUpdate 가 참인 경우 업데이트
				if(qryComp.isLazyUpdate^isLazyCompUpdate) continue;
			}
			
			//asoocool, 컴포넌트 유효성 검사
			if(!qryComp.isValid()) continue;
			
			if(this.isVisibleUpdate)
			{
				//비활성화된 view 는 적용되지 않도록
				// qryComp가 container인 경우에는 getRootView 함수가 없으므로 체크한다.
				if(qryComp.getRootView)
				{
					item = qryComp.getRootView()._item;
					//if(item && $(item).is(':hidden')) continue;
					if(item && item.style.display == 'none') continue;
				}
			}
			
			if(qryComp.realCallbacks && qryComp.realCallbacks[dataKey]) 
			{
				cbRet = undefined;
				
				cbObj = qryComp.realCallbacks[dataKey];
				
				if(cbObj.cb) cbRet = cbObj.cb.call(this, queryData);
				
				if(cbRet != false) 
				{
					qryComp.updateComponent(queryData);
					
					if(cbObj.au) cbObj.au.call(this, queryData);
				}
			}
			
			else if(cbRet != false) qryComp.updateComponent(queryData);
		}
	}
		
	return compArray;
};

QueryManager.prototype.sendProcessByComp = function(acomp, groupName, beforeInBlockBuffer, afterOutBlockData, afterUpdateComponent)
{
	var menuNo = acomp.getContainerId(),ret = [];

	for(var queryName in acomp.dataKeyMap)
		ret.push(this.sendProcess(AQuery.getQuery(queryName), menuNo, groupName, beforeInBlockBuffer, afterOutBlockData, afterUpdateComponent));
	
	return ret;
};

QueryManager.prototype.sendProcessByComps = function(acomps, groupName, beforeInBlockBuffer, afterOutBlockData, afterUpdateComponent)
{
	var acomp, menuNo, queryName, ret = [];
	for(var i=0; i<acomps.length; i++)
	{
		acomp = acomps[i];
		menuNo = acomp.getContainerId();
		
		for(queryName in acomp.dataKeyMap)
			ret.push(this.sendProcess(AQuery.getQuery(queryName), menuNo, groupName, beforeInBlockBuffer, afterOutBlockData, afterUpdateComponent));
	}
	
	return ret;
};

QueryManager.prototype.sendProcessByName = async function(queryName, menuNo, groupName, beforeInBlockBuffer, afterOutBlockData, afterUpdateComponent)
{
	return [this.sendProcess(await AQuery.getSafeQuery(queryName), menuNo, groupName, beforeInBlockBuffer, afterOutBlockData, afterUpdateComponent)];
};

QueryManager.prototype.sendProcessByNames = async function(queryNames, menuNo, groupName, beforeInBlockBuffer, afterOutBlockData, afterUpdateComponent)
{
	var ret = [];
	
	for(var i=0; i<queryNames.length; i++)
		ret.push(this.sendProcess(await AQuery.getSafeQuery(queryNames[i]), menuNo, groupName, beforeInBlockBuffer, afterOutBlockData, afterUpdateComponent));

	return ret;
};

//afterOutBlockData 값에 -1 을 셋팅하면 전송만 하고 응답 처리는 하지 않는다.
//beforeInBlockBuffer : 데이터를 전송하기 전에 호출되는 함수(네트웍버퍼에 데이터를 셋팅하기 바로 전에 호출된다.)
//afterOutBlockData : 데이터가 수신되면 호출되는 함수(수신된 네트웍 버퍼의 내용을 AQueryData 로 파싱한 후 호출된다.) 
//afterUpdateComponent : 수신된 데이터(AQueryData)를 컴포넌트에 반영한 후에 호출되는 함수
QueryManager.prototype.sendProcess = function(aquery, menuNo, groupName, beforeInBlockBuffer, afterOutBlockData, afterUpdateComponent)
{
	if(!aquery) return -1;
	
//############################################
//	if(this.isShowProgress && afterOutBlockData != -1) AIndicator.show();
//############################################

	var trName = aquery.getName();

	this.errorData.trName = trName;
	
	this.sendInfo.trName = trName;
	this.sendInfo.menuNo = menuNo;
	this.sendInfo.groupName = groupName; 
	

	var queryData = this.makeQueryData(aquery, true);
	queryData.inBlockPrepare();

	var qryComp, compArray = aquery.getQueryComps(menuNo, 'input'), i, item;
	
	if(compArray)
	{
		for(i=0; i<compArray.length; i++)
		{
			qryComp = compArray[i];
			
			if(this.isVisibleUpdate)
			{
				//비활성화된 탭은 적용되지 않도록
				//비활성화된 view 는 적용되지 않도록
				item = qryComp.getRootView()._item;
				//if(item && $(item).is(':hidden')) continue;
				if(item && item.style.display == 'none') continue;
			}

			//groupName 을 지정해 줬으면 같은 그룹네임인지 비교
			if( groupName && groupName!=qryComp.getGroupName() ) continue;			
			
			qryComp.updateQueryData(queryData);
		}
	}
	
	var listener, qLen = this.queryListeners.length;

	//전송버퍼에 데이터를 채우기 전에 호출된다.
	//######## beforeInBlockBuffer
	
	//if(beforeInBlockBuffer) beforeInBlockBuffer.call(this, queryData);
	
	//beforeInBlockBuffer 함수에서 false 가 리턴되면 더이상 진행하지 않는다.
	if(beforeInBlockBuffer && beforeInBlockBuffer.call(this, queryData)==false) return -1;
	
	for(i=0; i<qLen; i++)
	{
		listener = this.queryListeners[i];
		
		//if(listener.beforeInBlockBuffer) listener.beforeInBlockBuffer(queryData, this);
		
		//beforeInBlockBuffer 함수에서 false 가 리턴되면 더이상 진행하지 않는다.
		if(listener.beforeInBlockBuffer && listener.beforeInBlockBuffer(queryData, this)==false) return -1;
	}
	
	//########
	
//인디케이터는 이 시점부터 보여준다. 위에서 return 될 수 있으므로	
//############################################
	if(this.isShowProgress && afterOutBlockData != -1) AIndicator.show();
//############################################
	
	
	var packetId = 0, dataOffset = 0, sendObj = null;//json 방식의 문자열 전송 시 사용
	
	if(this.sndBuf)
	{
		dataOffset = this.getInDataOffset(aquery, queryData);
		
		queryData.inBlockBuffer(this.sndBuf, dataOffset);

		this.sndBuf.setDataSize(this.sndBuf.getOffset());

		packetId = this.makeHeader(queryData, this.sndBuf, menuNo);
	}
	else
	{
		sendObj = {};
		
		queryData.inBlockBuffer(sendObj);
		
		packetId = this.makeHeader(queryData, sendObj, menuNo);
	}

	
	this.sendInfo.packetId = packetId;
	
	
	//---------------------------------------------------------
	
	//데이터를 전송하기 바로 전에 호출된다.
	//######## beforeSendBufferData
	for(i=0; i<qLen; i++)
	{
		listener = this.queryListeners[i];
		
		if(listener.beforeSendBufferData) 
		{
			listener.beforeSendBufferData(this);
		}
	}
	//########
	
	
	//afterOutBlockData 값에 -1 을 셋팅하면 전송만 하고 응답 처리는 하지 않는다.
	if(afterOutBlockData != -1)
	{
		//asoocool dblTostr
		var cbObj = 
		{
			'menuNo': menuNo, 'groupName': groupName, 'func': afterOutBlockData, 'timeout': null,
			'trName': trName, 'dblTostr': this.dblTostr,
			'ucfunc': afterUpdateComponent	
		};

		//asoocool dblTostr
		//cbObj 에 셋팅하고 바로 지운다.
		this.dblTostr = undefined;

		this.setQueryCallback(packetId, cbObj);

		//------------------------------------------------------------
		//	네트웍 타임아웃 셋팅
		if(this.timeoutSec>0)
		{
			var thisObj = this;

			cbObj.timeout = setTimeout(function()
			{
				if(thisObj.isShowProgress) AIndicator.hide();

				//타임아웃 에러 데이터 세팅
				thisObj.setTimeoutErrorData(trName, menuNo, groupName);

				//콜백 객체 제거
				thisObj.getQueryCallback(packetId);

				//afterOutBlockData 호출하여 타임아웃 상태를 알림
				if(afterOutBlockData) afterOutBlockData.call(thisObj, null);
				//if(listener && listener.afterOutBlockData) listener.afterOutBlockData(null, groupName, thisObj.errorData.trName, thisObj);

				qLen = thisObj.queryListeners.length;
				for(i=0; i<qLen; i++)
				{
					listener = thisObj.queryListeners[i];

					if(listener.afterRecvBufferData) listener.afterRecvBufferData(thisObj);
					if(listener.afterOutBlockData) listener.afterOutBlockData(null, thisObj);
				}


			}, this.timeoutSec*1000);
		}
	}
	
	//---------------------------------------------------------
	// 송신할 전문 로그 남기는 함수
	this.send_log_helper();
	//---------------------------------------------------------
	
	this.sendByType({
		packetId: packetId,
		menuNo: menuNo,
		trName: trName,
		groupName: groupName,
		queryData: queryData,
		sndBuf: this.sndBuf,
		sendObj: sendObj
	});

	return packetId;
};

//if buf is array, type of array is Uint8Array, String, ABuffer
QueryManager.prototype.sendBufferData = function(buf)
{
	var thisObj = this;
	if(!this.netIo.isStart())
	{
		//console.log('----------------------- sendBufferData fail! : socket is closed.');
		
		if(this.isShowProgress) AIndicator.hide();
		return;
	}
	
	//if(buf instanceof ABuffer) buf = buf.subDataArray();
	
	this.netIo.sendData(buf, function(result)
	{
		if(!result) 
		{
			thisObj.onSendFail();
		}
	});
};


/*
QueryManager.prototype.sendBufferData = function(abuf)
{
	var thisObj = this;
	if(!this.netIo.isStart())
	{
		//console.log('----------------------- sendBufferData fail! : socket is closed.');
		
		if(this.isShowProgress) AIndicator.hide();
		return;
	}
	
	var sendLen = abuf.getDataSize();
	
	this.netIo.sendData(abuf.subArray(0, sendLen), function(result)
	{
		if(!result) 
		{
			thisObj.onSendFail();
		}
	});
};
*/

QueryManager.prototype.onSendFail = function()
{
	if(this.netIo.isStart())
	{
		AIndicator.endOltp();
		
		AToast.show('통신 상태가 원활하지 않습니다.');
		//theApp.autoLoginProcess('통신 상태가 원활하지 않습니다.(2) : '+this.errorData.trName, true);
	}

};

QueryManager.prototype.makePacketId = function()
{
	return ++this.packetId;
};

QueryManager.prototype.addSkipErrorCode = function(qryName, errorCode)
{
	var array = this.errCodeMap[qryName];
	if(!array) array = this.errCodeMap[qryName] = [];
	
	for(var i=0; i<array.length; i++)
		if(array[i]==errorCode) return;
	
	array.push(errorCode);
};

QueryManager.prototype.removeSkipErrorCode = function(qryName, errorCode)
{
	var array = this.errCodeMap[qryName];
	if(!array) return;
	
	for(var i=0; i<array.length; i++)
	{
		if(array[i]==errorCode)
		{
			array.splice(i, 1);
			if(array.length==0) delete this.errCodeMap[qryName];
			
			return;
		}
	}
};

QueryManager.prototype.isSkipErrorCode = function(qryName, errorCode)
{
	var array = this.errCodeMap[qryName];
	if(!array) return false;
	
	for(var i=0; i<array.length; i++)
	{
		if(array[i]==errorCode)
			return true;
	}
	
	return false;
};

// 송신할 전문 로그 남기는 함수
QueryManager.prototype.send_log_helper = function()
{
};


// 수신된 전문 로그 남기는 함수
QueryManager.prototype.recv_log_helper = function()
{
};

// option = { realQuery:'', keyBlock:'InBlock1', realField:'', updateType: 0 }
//beforeInBlockBuffer : 데이터를 전송하기 전에 호출되는 함수(네트웍버퍼에 데이터를 셋팅하기 바로 전에 호출된다.)
//afterOutBlockData : 데이터가 수신되면 호출되는 함수(수신된 네트웍 버퍼의 내용을 AQueryData 로 파싱한 후 호출된다.) 
//afterUpdateComponent : 수신된 데이터(AQueryData)를 컴포넌트에 반영한 후에 호출되는 함수
//realCallback : 리얼 데이터가 수신되면 호출되는 함수
//realAfterUpdate : 수신된 리얼 데이터를 컴포넌트에 반영한 후에 호출되는 함수
QueryManager.prototype.sendProcessWithReal = function(queryName, menuNo, groupName, beforeInBlockBuffer, afterOutBlockData, afterUpdateComponent, option, realCallback, realAfterUpdate)
{
	var dataKeyArr = [];
	
	if(!option.keyBlock) option.keyBlock = 'InBlock1';

	return this.sendProcessByName(queryName, menuNo, groupName, 
	
	function(queryData)
	{
		beforeInBlockBuffer.call(this, queryData);
		
		//if(option.keyBlock.charCodeAt(0)==0x49)	//I
		if(option.keyBlock.indexOf('InBlock')>-1)
		{
			var blockData = queryData.getBlockData(option.keyBlock);
			
			for(var i=0; i<blockData.length; i++)
				dataKeyArr.push(blockData[i][option.realField]);
		}
	},
	
	function(queryData)
	{
		if(queryData)
		{
			//if(option.keyBlock.charCodeAt(0)==0x4F)	//O
			if(option.keyBlock.indexOf('OutBlock')>-1)
			{
				var blockData = queryData.getBlockData(option.keyBlock);

				for(var i=0; i<blockData.length; i++)
					dataKeyArr.push(blockData[i][option.realField]);
			}

			if(typeof option.realQuery == 'string') option.realQuery = [option.realQuery];
			for(var i=0; i<option.realQuery.length; i++)
			{
				this.realProcMap[menuNo + queryName + option.realQuery[i]] = dataKeyArr;
				this.registerReal(option.realQuery[i], option.realField, dataKeyArr, menuNo, option.updateType, realCallback, realAfterUpdate);
			}
		}
		
		afterOutBlockData.call(this, queryData);
	},
	afterUpdateComponent);

};

QueryManager.prototype.clearRealProcess = function(queryName, menuNo, realQuery)
{
	if(typeof realQuery == 'string') realQuery = [realQuery];

	var key, dataKeyArr;
	for(var i=0; i<realQuery.length; i++)
	{
		key = menuNo + queryName + realQuery[i];
		dataKeyArr = this.realProcMap[key];
		
		if(dataKeyArr) delete this.realProcMap[key];
		else dataKeyArr = [];
		
		this.unregisterReal(realQuery[i], dataKeyArr, menuNo);
	}
};
