//MockData
const FRIENDLIST_MOCK_DATA = [
            { profileImg: "https://picsum.photos/seed/pic1/100", name: "홍길동전", profileMessage: "안녕하세요!" },
            { profileImg: "https://picsum.photos/seed/pic2/100", name: "임꺽정", profileMessage: "" },
            { profileImg: "https://picsum.photos/seed/pic3/100", name: "장길산", profileMessage: "즐거운 하루 보내세요." },
            { profileImg: "https://picsum.photos/seed/pic4/100", name: "이몽룡", profileMessage: "" },
            { profileImg: "https://picsum.photos/seed/pic5/100", name: "성춘향", profileMessage: "오늘도 파이팅!" },
            { profileImg: "https://picsum.photos/seed/pic6/100", name: "변학도", profileMessage: "" },
            { profileImg: "https://picsum.photos/seed/pic7/100", name: "심청이", profileMessage: "반가워요 😊" },
            { profileImg: "https://picsum.photos/seed/pic8/100", name: "심봉사", profileMessage: "" },
            { profileImg: "https://picsum.photos/seed/pic9/100", name: "춘향모", profileMessage: "맛있는 점심 드세요." },
            { profileImg: "https://picsum.photos/seed/pic10/100", name: "방자", profileMessage: "" },
            { profileImg: "https://picsum.photos/seed/pic11/100", name: "향단이", profileMessage: "좋은 하루!" },
            { profileImg: "https://picsum.photos/seed/pic12/100", name: "장화", profileMessage: "" },
            { profileImg: "https://picsum.photos/seed/pic13/100", name: "홍련", profileMessage: "화이팅합시다!" },
            { profileImg: "https://picsum.photos/seed/pic14/100", name: "김삿갓", profileMessage: "" },
            { profileImg: "https://picsum.photos/seed/pic15/100", name: "허균", profileMessage: "멋진 하루 되세요~" }
];






let express = require('express');
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
	
	res.json(resData);	
	// res.end();
});

module.exports = router;
