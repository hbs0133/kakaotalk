
ChattingView = class ChattingView extends AView
{
	constructor()
	{
		super()

		//TODO:edit here

	}

	init(context, evtListener)
	{
		super.init(context, evtListener)

		this.chattingMockData = [
                                    {
                                        profileImg: "https://randomuser.me/api/portraits/men/1.jpg",
                                        name: "홍길동",
                                        message: "안녕하세요, 허균님.",
                                        sentAt: "2025-06-10T14:00:00Z",
                                        isAuthor: true
                                    },
                                    {
                                        profileImg: "https://randomuser.me/api/portraits/men/2.jpg",
                                        name: "허균",
                                        message: "안녕하세요, 홍길동님. 반갑습니다.",
                                        sentAt: "2025-06-10T14:00:20Z",
                                        isAuthor: false
                                    },
                                    {
                                        profileImg: "https://randomuser.me/api/portraits/men/1.jpg",
                                        name: "홍길동",
                                        message: "오늘 회의 준비는 잘 되셨나요?",
                                        sentAt: "2025-06-10T14:01:10Z",
                                        isAuthor: true
                                    },
                                    {
                                        profileImg: "https://randomuser.me/api/portraits/men/2.jpg",
                                        name: "허균",
                                        message: "네, 자료는 모두 준비해두었습니다.",
                                        sentAt: "2025-06-10T14:01:45Z",
                                        isAuthor: false
                                    },
                                    {
                                        profileImg: "https://randomuser.me/api/portraits/men/1.jpg",
                                        name: "홍길동",
                                        message: "좋네요. 그럼 시간 맞춰 시작하겠습니다.",
                                        sentAt: "2025-06-10T14:02:10Z",
                                        isAuthor: true
                                    },
                                    {
                                        profileImg: "https://randomuser.me/api/portraits/men/2.jpg",
                                        name: "허균",
                                        message: "네, 준비하고 있겠습니다.",
                                        sentAt: "2025-06-10T14:02:40Z",
                                        isAuthor: false
                                    },
                                    {
                                        profileImg: "https://randomuser.me/api/portraits/men/1.jpg",
                                        name: "홍길동",
                                        message: "회의 자료는 메일로도 보내드릴까요?",
                                        sentAt: "2025-06-10T14:03:00Z",
                                        isAuthor: true
                                    },
                                    {
                                        profileImg: "https://randomuser.me/api/portraits/men/2.jpg",
                                        name: "허균",
                                        message: "네, 보내주시면 좋겠습니다.",
                                        sentAt: "2025-06-10T14:03:25Z",
                                        isAuthor: false
                                    },
                                    {
                                        profileImg: "https://randomuser.me/api/portraits/men/1.jpg",
                                        name: "홍길동",
                                        message: "방금 전송드렸습니다.",
                                        sentAt: "2025-06-10T14:03:50Z",
                                        isAuthor: true
                                    },
                                    {
                                        profileImg: "https://randomuser.me/api/portraits/men/2.jpg",
                                        name: "허균",
                                        message: "확인했습니다. 감사합니다.",
                                        sentAt: "2025-06-10T14:04:10Z",
                                        isAuthor: false
                                    },
                                    {
                                        profileImg: "https://randomuser.me/api/portraits/men/1.jpg",
                                        name: "홍길동",
                                        message: "그럼 잠시 후에 뵙겠습니다.",
                                        sentAt: "2025-06-10T14:04:35Z",
                                        isAuthor: true
                                    },
                                    {
                                        profileImg: "https://randomuser.me/api/portraits/men/2.jpg",
                                        name: "허균",
                                        message: "네, 곧 뵙겠습니다.",
                                        sentAt: "2025-06-10T14:04:50Z",
                                        isAuthor: false
                                    },
                                    {
                                        profileImg: "https://randomuser.me/api/portraits/men/1.jpg",
                                        name: "홍길동",
                                        message: "혹시 준비하실 자료 중 문의사항 있으시면 알려주세요.",
                                        sentAt: "2025-06-10T14:05:10Z",
                                        isAuthor: true
                                    },
                                    {
                                        profileImg: "https://randomuser.me/api/portraits/men/2.jpg",
                                        name: "허균",
                                        message: "네, 궁금한 점 있으면 바로 말씀드리겠습니다.",
                                        sentAt: "2025-06-10T14:05:30Z",
                                        isAuthor: false
                                    },
                                    {
                                        profileImg: "https://randomuser.me/api/portraits/men/1.jpg",
                                        name: "홍길동",
                                        message: "좋은 하루 되세요 ☺️",
                                        sentAt: "2025-06-10T14:05:50Z",
                                        isAuthor: true
                                    }
                                ];

	}

	async onInitDone()
	{
		super.onInitDone()

         for(const item of this.chattingMockData){
            item.isAuthor ? await this.chattingList.addItem('Source/ListViewItems/ChattingListViewItem_Author/ChattingListViewItem_Author.lay', [item]):
            await this.chattingList.addItem('Source/ListViewItems/ChattingListViewItem_Other/ChattingListViewItem_Other.lay', [item])
        }

	}

	onActiveDone(isFirst)
	{
		super.onActiveDone(isFirst)

		

	}


	onXbtnClick(comp, info, e)
	{

		this.getContainer().close();

	}
}

