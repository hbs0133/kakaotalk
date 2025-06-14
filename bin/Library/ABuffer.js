

ABuffer = class ABuffer
{
    constructor(size)
    {
        if(size>0) this.buf = new Uint8Array(size);
        else this.buf = null;
        
        this.offset = 0;
        this.dataSize = 0;
        
        this.emptyChar = ABuffer.emptyChar;//' ' 
        this.emptyNumChar = ABuffer.emptyNumChar;//'0';
        this.charset = null;
        this.encoder = null;
        this.decoder = null;
    }
}

//static 함수에서 쓰이는 값
ABuffer.emptyChar = 0x20;
ABuffer.emptyNumChar = 0x30;

ABuffer.MAX_INT = Math.pow(2, 53);
ABuffer.MASK31 = 0x7fffffff;
ABuffer.MASK32 = 0xffffffff;
ABuffer.VAL31 = 0x80000000;
ABuffer.VAL32 = 0x100000000;

ABuffer.prototype.getBufSize = function() { return this.buf.length; };
ABuffer.prototype.getBuffer = function() { return this.buf; };

ABuffer.prototype.getOffset = function() { return this.offset; };
ABuffer.prototype.getCharset = function() { return this.charset; };

ABuffer.prototype.setBuffer = function(buf) { this.buf = buf; };
ABuffer.prototype.setOffset = function(offset) { this.offset = offset; };
ABuffer.prototype.addOffset = function(add) { this.offset += add; };

ABuffer.prototype.setBufferByString = function(str) 
{
	try
	{
		this.buf = this.encoder.encode(str);
	}
	catch(e)
	{
		alert('setBufferByString:encoding error - ' + str);
	}
};

ABuffer.prototype.setDataSize = function(size) { this.dataSize = size; };
ABuffer.prototype.getDataSize = function() { return this.dataSize; };

ABuffer.prototype.EOF = function() { return (this.offset>=this.dataSize); };

ABuffer.prototype.setCharset = function(charset) 
{
	this.charset = charset;
	
	if(this.charset)
	{
		this.encoder = new ATextEncoder(this.charset);
		this.decoder = new ATextDecoder(this.charset);
	}
	else
	{
		this.encoder = null;
		this.decoder = null;
	}
};

ABuffer.prototype.setEmptyChar = function(emptyChar)
{
	this.emptyChar = emptyChar;
};

ABuffer.prototype.setEmptyNumChar = function(emptyNumChar)
{
	this.emptyNumChar = emptyNumChar;
};

//this.buf 의 offset 위치에 fromBuf 의 내용을 복사
ABuffer.prototype.copyBuffer = function(fromBuf, offset) 
{
	this.buf.set(fromBuf, offset);
};


ABuffer.prototype.fillBuffer = function(value, size)
{
	if(!size) size = this.buf.length;
	
	for(var i=0; i<size; i++)
		this.buf[i] = value;
};

//buf[start] ~ buf[end-1]
ABuffer.prototype.subArray = function(start, end)
{
	return this.buf.subarray(start, end);
};

ABuffer.prototype.subDataArray = function()
{
	return this.buf.subarray(0, this.getDataSize());
};


//------------------------------------------------------------
//	about byte
ABuffer.prototype.setByte = function(offset, value)
{
	this.buf[offset] = value;
	this.offset = offset + 1;
};

ABuffer.prototype.addByte = function(value) 
{ 
	this.setByte(this.offset, value);
};

ABuffer.prototype.getByte = function(offset)
{
	this.offset = offset + 1;
	return this.buf[offset];
};

ABuffer.prototype.nextByte = function()
{
	return this.getByte(this.offset); 
};

//------------------------------------------------------------
//	about word
ABuffer.prototype.setWord = function(offset, value)	{ this.setType(offset, 2, value); };
ABuffer.prototype.addWord = function(value)			{  this.setType(this.offset, 2, value); };
//unsigned short
ABuffer.prototype.getWord = function(offset)		{ return this.getType(offset, 2, true); };
ABuffer.prototype.nextWord = function()				{ return this.getType(this.offset, 2, true); };
//signed short
ABuffer.prototype.getShort = function(offset)		{ return this.getType(offset, 2, false); };
ABuffer.prototype.nextShort = function()			{ return this.getType(this.offset, 2, false); };


//------------------------------------------------------------
//	about dword
ABuffer.prototype.setDWord = function(offset, value)	{ this.setType(offset, 4, value); };
ABuffer.prototype.addDWord = function(value)			{ this.setType(this.offset, 4, value); };
//unsigned Int
ABuffer.prototype.getDWord = function(offset)			{ return this.getType(offset, 4, true); };
ABuffer.prototype.nextDWord = function()				{ return this.getType(this.offset, 4, true); };
//signed Int
ABuffer.prototype.getInt = function(offset)				{ return this.getType(offset, 4, false); };
ABuffer.prototype.nextInt = function()					{ return this.getType(this.offset, 4, false); };

//------------------------------------------------------------
//	about type number

/*
ABuffer.prototype.setType = function(offset, size, value)
{
	value = parseInt(value, 10);
	
	if(size==8)
	{
        var hi = Math.abs(value);
        var lo = hi % ABuffer.VAL32;
        hi = hi / ABuffer.VAL32;
        if(hi>ABuffer.VAL32) console.log(hi  + ' is outside Int64 range!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
        hi = hi | 0;
	
		// Copy bytes to buffer
		var b = this.buf, i;
		
		for(i=7; i>=0; i--) 
		{
			b[offset+i] = lo & 0xff;
		  	lo = i == 4 ? hi : lo >>> 8;
		}
		
		// Restore sign of passed argument
		if(value<0) 
		{
			var carry = 1, v = 0;
			for(i=offset+7; i>=offset; i--) 
			{
				v = (b[i] ^ 0xff) + carry;
				b[i] = v & 0xff;
				carry = v >> 8;
			}
		}
	}
	else
	{
		for(var i=0; i<size; i++)
			this.buf[offset+i] = ( value >> ((size-1-i)*8) );
	}
	
	this.offset = offset + size;	
};
*/

ABuffer.prototype.setType = function(offset, size, value)
{
	value = parseInt(value, 10);
	
	var hi = Math.abs(value);
	var lo = hi % ABuffer.VAL32;
	
	hi = hi / ABuffer.VAL32;
	
	if(hi>ABuffer.VAL32) console.log(hi  + ' is outside Int64 range!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
	hi = hi | 0;

	// Copy bytes to buffer
	var b = this.buf, i;

	for(i=size-1; i>=0; i--) 
	{
		b[offset+i] = lo & 0xff;
		lo = i == 4 ? hi : lo >>> 8;
	}

	// Restore sign of passed argument
	if(value<0) 
	{
		var carry = 1, v = 0;
		for(i=offset+size-1; i>=offset; i--) 
		{
			v = (b[i] ^ 0xff) + carry;
			b[i] = v & 0xff;
			carry = v >> 8;
		}
	}
	
	this.offset = offset + size;
};


ABuffer.prototype.addType = function(size, value) 
{ 
	this.setType(this.offset, size, value);
};


ABuffer.prototype.getType = function(offset, size, unsigned)
{
	this.offset = offset + size;
	
	var ret = 0;
	var b = this.buf, negate = 0, carry = 1, v = 0;
	
	if(!unsigned) negate = (b[offset] & 0x80);

	for(var i=size-1, m=1; i >= 0; i--, m *= 256) 
	{
		v = b[offset+i];

		// 2's complement for negative numbers
		if(negate) 
		{
			v = (v ^ 0xff) + carry;
			carry = v >> 8;
			v = v & 0xff;
		}

		ret += v * m;
	}

	// Return Infinity if we've lost integer precision
	//if (ret >= ABuffer.MAX_INT) 
	//{
	//	return negate ? -Infinity : Infinity;
	//}

	return negate ? -ret : ret;
};


/*
ABuffer.prototype.getType = function(offset, size)
{
	this.offset = offset + size;
	
	var ret = 0;
	
	if(size==8)
	{
		var hi = this.getType(offset, 4);
		var lo = this.nextType(4);
	
		ret = (hi << 32) | lo;
		return ret;
	}
	else
	{
		for(var i=0; i<size; i++)
			ret |= ( this.buf[offset+i] << ((size-1-i)*8) );
			
		return ret;
	}
};
*/

ABuffer.prototype.nextType = function(size, unsigned)
{
	return this.getType(this.offset, size, unsigned);
};


//------------------------------------------------------------
//	set char
ABuffer.prototype.setChar = function(offset, value)
{
	if(value=='') value = ' ';
	
	this.buf[offset] = value.charCodeAt(0);
	this.offset = offset + 1;
};

ABuffer.prototype.addChar = function(value) 
{
	this.setChar(this.offset, value);
};

//-------------------------------------------------------------
//	set string
// 	size 가 1보다 작으면 value 의 길이만큼 공백없이 셋팅된다. 

ABuffer.prototype.setOriString = function(offset, size, value)
{
	if(value==null || value==undefined) value = '';
	
	//숫자를 문자열로 변환
	else value = value.toString();
	
	var i = 0;
	if(size<1) size = value.length;
	var len = Math.min(size, value.length);
	
	for(; i<len; i++)
		this.buf[offset+i] = value.charCodeAt(i);
	
	//빈자리는 공백문자로 채움
	for(; i<size; i++)
		this.buf[offset+i] = this.emptyChar;
	
	this.offset = offset + size;
};

ABuffer.prototype.addOriString = function(size, value) 
{
	this.setOriString(this.offset, size, value); 
};


ABuffer.prototype.setString = function(offset, size, value)
{
	if(value==null || value==undefined) value = '';
	
	//숫자를 문자열로 변환
	else value = value.toString();
	
	var i = 0, inputSize;
	
	if(this.charset) 
	{
		try
		{
			var encArr = this.encoder.encode(value);
			if(size<1) size = encArr.length; 
			inputSize = Math.min(size, encArr.length);
			for(; i<inputSize; i++)
				this.buf[offset+i] = encArr[i];
		}
		catch(e)
		{
			alert('encoding error - ' + value);
			if(size<1) size = value.length;
			inputSize = Math.min(size, value.length);
			//인코딩 에러가 날 경우 공백으로 셋팅
			for(i=0; i<inputSize; i++)
				this.buf[offset+i] = this.emptyChar;
			
			if(size<1) size = value.length;
		}
	}
	else
	{
		if(size<1) size = value.length;
		inputSize = Math.min(size, value.length);
		for(; i<inputSize; i++)
			this.buf[offset+i] = value.charCodeAt(i);
		
	}
	
	//빈자리는 공백으로 채움
	for(; i<size; i++)
		this.buf[offset+i] = this.emptyChar;
	
	this.offset = offset + size;
};

ABuffer.prototype.addString = function(size, value) 
{
	this.setString(this.offset, size, value); 
};



//--------------------------------------------------------------
//	set int to string
ABuffer.setNumString = function(buf, offset, size, value, emptyNumChar)
{
	if(value==null || value==undefined || isNaN(value)) value = '0';
	
	//숫자를 문자열로 변환
	else value = value.toString();
	
	if(emptyNumChar == undefined) emptyNumChar = ABuffer.emptyNumChar;
	
	var i = 0;
	if(size<1) size = value.length;
	else
	{
		//빈자리는 0 으로 채움
		var valueInx = size - value.length; 
		for(; i<valueInx; i++)
			buf[offset+i] = emptyNumChar;
	}
	
	//실제 숫자를 채움
	for(var j=0; i<size; i++, j++)
		buf[offset+i] = value.charCodeAt(j);
	
	return size;
};

ABuffer.prototype.setNumString = function(offset, size, value)
{
	size = ABuffer.setNumString(this.buf, offset, size, value, this.emptyNumChar);
	
	this.offset = offset + size;
};

ABuffer.prototype.addNumString = function(size, value) 
{
	this.setNumString(this.offset, size, value); 
};

///////////////////////////////////////////////////////////////////
//	sign number to string 
//	+000100, -001.10 -> size = 7
ABuffer.prototype.setSNumString = function(offset, size, value)
{
	if(value==null || value==undefined) 
	{
		value = '0';
		this.buf[offset] = 0x2B;			//+
	}
	
	//숫자를 문자열로 변환
	else 
	{
		if(value<0) 
		{
			this.buf[offset] = 0x2D;	//-
			//value *= -1;				//부호를 셋팅했으므로 양수화 한다.
			value = value.toString().substring(1);	//부호 제거
		}
		else 
		{
			this.buf[offset] = 0x2B;	//+
			value = value.toString();
		}
	
		//value = value.toString();
	}
		
	var i = 1;
	
	if(size<1) size = value.length + 1;	//부호 자리 추가
	else
	{
		//size++;	//부호 자리 추가
		
		//빈자리는 0 으로 채움
		var valueInx = size - value.length; 
		for(; i<valueInx; i++)
			this.buf[offset+i] = this.emptyNumChar;
	}
	
	//실제 숫자를 채움
	for(var j=0; i<size; i++, j++)
		this.buf[offset+i] = value.charCodeAt(j);
	
	this.offset = offset + size;
};

ABuffer.prototype.addSNumString = function(size, value) 
{
	this.setSNumString(this.offset, size, value); 
};

ABuffer.prototype.setBinary = function(offset, size, value)
{
	if(value)
	{
		this.buf.set(value, offset);

		var i = value.length;

		//빈자리는 공백으로 채움
		for(; i<size; i++)
			this.buf[offset+i] = 0x00;
	}
	
	this.offset = offset + size;
	
	//this.buf.set(value, offset);
	//this.offset = offset + value.length;
};

ABuffer.prototype.addBinary = function(size, value) 
{
	this.setBinary(this.offset, size, value);
};


//------------------------------------------------------------
//	get string


ABuffer.prototype.getBase64String = function(offset, size)
{
	this.offset = offset + size;
	return Base64.btoaArray(this.buf.subarray(offset, offset+size));
};

ABuffer.prototype.getOriString = function(offset, size, noTrim)
{
	var ret = '';
	
	for(var i=0; i<size; i++)
	{
		if(this.buf[offset+i]==0) break;
		else ret += String.fromCharCode(this.buf[offset+i]);
	}

	this.offset = offset + size;
	
	if(noTrim) return ret;
	else return $.trim(ret);
};

ABuffer.prototype.nextOriString = function(size, noTrim)
{
	return this.getOriString(this.offset, size, noTrim);
};

ABuffer.prototype.getString = function(offset, size, noTrim)
{
	var ret = '';
	
	if(this.charset) 
	{
		for(var i=0; i<size; i++)
			if(this.buf[offset+i]==0) break;
		
		ret = this.decoder.decode(this.buf.subarray(offset, offset+i));
	}
	else
	{
		for(var i=0; i<size; i++)
		{
			if(this.buf[offset+i]==0) break;
			else ret += String.fromCharCode(this.buf[offset+i]);
		}
	}

	this.offset = offset + size;
	
	if(noTrim) return ret;
	else return $.trim(ret);
};

ABuffer.prototype.nextString = function(size, noTrim)
{
	return this.getString(this.offset, size, noTrim);
};

ABuffer.prototype.getStringTo = function(offset, endValue)
{
	var ret = '', size;
	
	if(this.charset) 
	{
		for(size=0; true; size++)
		{
			if(this.buf[offset+size]==endValue) 
				break;
		}
		
		if(size>0) ret = this.decoder.decode(this.buf.subarray(offset, offset+size));
	}
	else
	{
		for(size=0; true; size++)
		{
			if(this.buf[offset+size]==endValue) 
				break;
				
			ret += String.fromCharCode(this.buf[offset+size]);
		}
	}

	this.offset = offset + size + 1;
	
	return ret;
};

ABuffer.prototype.nextStringTo = function(endValue)
{
	return this.getStringTo(this.offset, endValue);
};


//------------------------------------------------------------
//	get int
ABuffer.prototype.getParseInt = function(offset, size)
{
	var ret = '';
	for(var i=0; i<size; i++)
		ret += String.fromCharCode(this.buf[offset+i]);

	this.offset = offset + size;

	return parseInt(ret, 10);
};

ABuffer.prototype.nextParseInt = function(size)
{
	return this.getParseInt(this.offset, size);
};

//------------------------------------------------------------
//	get number
ABuffer.prototype.getParseFloat = function(offset, size)
{
	var ret = '';
	for(var i=0; i<size; i++)
		ret += String.fromCharCode(this.buf[offset+i]);

	this.offset = offset + size;

	return parseFloat(ret);
};

ABuffer.prototype.nextParseFloat = function(size)
{
	return this.getParseFloat(this.offset, size);
};

ABuffer.prototype.getIpString = function(offset)
{
	var ret = '', val = '', i, j, inx = 0;
	
	for(i=0; i<4; i++)
	{
		val = '';
		for(j=0; j<3; j++)
		{
			val += String.fromCharCode(this.buf[offset+inx]);
			inx++;
		}
		
		if(i>0) ret += ('.' + parseInt(val, 10));
		else ret += ('' + parseInt(val, 10));
	}

	this.offset = offset + inx;
	
	return ret;
};

ABuffer.prototype.nextIpString = function()
{
	return this.getIpString(this.offset);
};

ABuffer.prototype.getBinary = function(offset, size)
{
	this.offset = offset + size;
	
	return this.buf.subarray(offset, this.offset);	//buf[start] ~ buf[end-1]
};

ABuffer.prototype.nextBinary = function(size) 
{
	return this.getBinary(this.offset, size);
};


//for debug
ABuffer.prototype.printBySize = function(sizeInfo, offset, radix)
{
	if(offset>0) this.offset = offset;
	else this.offset = 0;
	
	var size, bInx = this.offset;
	var output = '', strHex = '', tmp = '';
	
	for(var i=0; i<sizeInfo.length; i++)
	{
		size = sizeInfo[i];
		
		tmp = '';
		
		for(var j=0; j<size; j++)
		{
			if(radix==undefined) strHex = String.fromCharCode(this.buf[bInx++]);
			else 
			{
				strHex = this.buf[bInx++].toString(radix);
				if(strHex.length<2) strHex = '0'+strHex;
			}

			tmp +=  strHex + ' ';
		}
		
		output += ( (i+1) + ' : ' + tmp + '\r\n' );
	}
	
	console.log(output);
	
	return output;
};

ABuffer.prototype.printBuffer = function(inx, size, radix)
{
	if(size==0) return;
	
	if(inx==undefined) inx = 0;
	if(size==undefined) size = this.getBufSize();
	
	var output = '';
	var strHex = '';
	
	for(var i=0; i<size; i++)
	{
		if(radix==undefined) strHex = String.fromCharCode(this.buf[i+inx]);
		else
		{
			strHex = this.buf[i+inx].toString(radix);
			if(strHex.length<2) strHex = '0'+strHex;
		}
		
		output +=  strHex + ' ';
		if((i+1)%10==0) output += '\r\n';
	}
	
	console.log(output);
	return output;
};










