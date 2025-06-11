let express = require('express');
const { FRIENDLIST_MOCK_DATA, MESSAGELIST_MOCK_DATA ,CHATTING_MOCK_DATA, CHATTING_INFO_MOCK_DATA } = require('../mockData');
let router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) 
{
   res.send("get요청 성공")

});

router.post('/', function(req, res, next) 
{
	res.header('Access-Control-Allow-Origin', '*');
  
	let data = JSON.parse(req.body.data);

	let resData = null;

	if(data.header.query_name=='login'){

		    // console.log(data.body.InBlock1[0].id);

			const INIT_ID = "asoocool"
			const INIT_PW = "1234"

			let userId = data.body.InBlock1[0].id;
			let userPw = data.body.InBlock1[0].pw;
			let status

			userId == INIT_ID && userPw == INIT_PW ? status = "pass" : status = "reject";
			
		resData = 
		{
			//클라이언트에서 보낸 헤더값을 그대로 다시 응답데이터에 셋팅한다.
			header: 
			{
				packet_id: data.header.packet_id,
				query_name: data.header.query_name,
				error_code: 1000
			}, 
			body: 
			{
				//이곳은 전문에 따라 다르게 응답값을 셋팅해 준다.
				OutBlock1: 
				[
					{
						"status" : status
					}
				]
			} 
		};
	}


	if(data.header.query_name=='friendList'){
		resData = 
		{
			//클라이언트에서 보낸 헤더값을 그대로 다시 응답데이터에 셋팅한다.
			header: 
			{
				packet_id: data.header.packet_id,
				query_name: data.header.query_name,
				error_code: 1000
			}, 
			body: 
			{
				//이곳은 전문에 따라 다르게 응답값을 셋팅해 준다.
				OutBlock1: FRIENDLIST_MOCK_DATA
			} 
		};
	}

	if(data.header.query_name == 'messageList'){
		resData = 
		{
			//클라이언트에서 보낸 헤더값을 그대로 다시 응답데이터에 셋팅한다.
			header: 
			{
				packet_id: data.header.packet_id,
				query_name: data.header.query_name,
				error_code: 1000
			}, 
			body: 
			{
				//이곳은 전문에 따라 다르게 응답값을 셋팅해 준다.
				OutBlock1: MESSAGELIST_MOCK_DATA
			} 
		};
	}

	if(data.header.query_name == "chatting"){
		resData = 
		{
			//클라이언트에서 보낸 헤더값을 그대로 다시 응답데이터에 셋팅한다.
			header: 
			{
				packet_id: data.header.packet_id,
				query_name: data.header.query_name,
				error_code: 1000
			}, 
			body: 
			{
				//이곳은 전문에 따라 다르게 응답값을 셋팅해 준다.
				OutBlock1: CHATTING_MOCK_DATA,
				OutBlock2: CHATTING_INFO_MOCK_DATA,
			} 
		};
	}

		if(data.header.query_name == "sendMessage"){

			const {message, sentAt, isAuthor, profileImg, name} = data.body.InBlock1[0];
			
			const newMessage = {
				"profileImg" : profileImg,
				"name" : name,
				"message" : message,
				"sentAt" : sentAt,
				"isAuthor" : isAuthor
			}

			// CHATTING_MOCK_DATA.push(newMessage)
		resData = 
		{
			//클라이언트에서 보낸 헤더값을 그대로 다시 응답데이터에 셋팅한다.
			header: 
			{
				packet_id: data.header.packet_id,
				query_name: data.header.query_name,
				error_code: 1000
			}, 
			body: 
			{
				OutBlock1: newMessage
			} 
		};
	}
	
	res.json(resData);	
	// res.end();
});

module.exports = router;
