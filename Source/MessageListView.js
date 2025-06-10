
MessageListView = class MessageListView extends AView
{
	constructor()
	{
		super()

		//TODO:edit here

	}

	init(context, evtListener)
	{
		super.init(context, evtListener)

		//TODO:edit here
        this.messageListMockData = [
            { messageImg: "https://picsum.photos/seed/msg1/100", name: "홍길동전", resentMessage: "안녕하세요!", resentMessageSentAt: "2025-06-10T07:45:00Z", notificationCount: 3 },
            { messageImg: "https://picsum.photos/seed/msg2/100", name: "임꺽정", resentMessage: "오늘 저녁에 시간 돼요?", resentMessageSentAt: "2025-06-09T14:15:00Z", notificationCount: 1 },
            { messageImg: "https://picsum.photos/seed/msg3/100", name: "장길산", resentMessage: "즐거운 하루 보내세요.", resentMessageSentAt: "2025-06-08T09:00:00Z", notificationCount: 0 },
            { messageImg: "https://picsum.photos/seed/msg4/100", name: "이몽룡", resentMessage: "잘 지내고 있죠?", resentMessageSentAt: "2025-06-10T17:30:00Z", notificationCount: 5 },
            { messageImg: "https://picsum.photos/seed/msg5/100", name: "성춘향", resentMessage: "오늘도 파이팅!", resentMessageSentAt: "2025-06-10T13:20:00Z", notificationCount: 0 },
            { messageImg: "https://picsum.photos/seed/msg6/100", name: "변학도", resentMessage: "회의자료 확인 부탁드립니다.", resentMessageSentAt: "2025-06-07T08:55:00Z", notificationCount: 2 },
            { messageImg: "https://picsum.photos/seed/msg7/100", name: "심청이", resentMessage: "반가워요 😊", resentMessageSentAt: "2025-06-10T10:15:00Z", notificationCount: 4 },
            { messageImg: "https://picsum.photos/seed/msg8/100", name: "심봉사", resentMessage: "감사합니다.", resentMessageSentAt: "2025-06-10T16:50:00Z", notificationCount: 0 },
            { messageImg: "https://picsum.photos/seed/msg9/100", name: "춘향모", resentMessage: "맛있는 점심 드세요.", resentMessageSentAt: "2025-06-09T12:35:00Z", notificationCount: 6 },
            { messageImg: "https://picsum.photos/seed/msg10/100", name: "방자", resentMessage: "네, 확인했습니다.", resentMessageSentAt: "2025-06-10T15:10:00Z", notificationCount: 0 },
            { messageImg: "https://picsum.photos/seed/msg11/100", name: "향단이", resentMessage: "좋은 하루!", resentMessageSentAt: "2025-06-10T11:25:00Z", notificationCount: 1 },
            { messageImg: "https://picsum.photos/seed/msg12/100", name: "장화", resentMessage: "사진 잘 받았어요.", resentMessageSentAt: "2025-06-08T18:45:00Z", notificationCount: 7 },
            { messageImg: "https://picsum.photos/seed/msg13/100", name: "홍련", resentMessage: "화이팅합시다!", resentMessageSentAt: "2025-06-10T06:05:00Z", notificationCount: 9 },
            { messageImg: "https://picsum.photos/seed/msg14/100", name: "김삿갓", resentMessage: "곧 연락드릴게요.", resentMessageSentAt: "2025-06-10T21:15:00Z", notificationCount: 0 },
            { messageImg: "https://picsum.photos/seed/msg15/100", name: "허균", resentMessage: "멋진 하루 되세요~", resentMessageSentAt: "2025-06-10T07:30:00Z", notificationCount: 8 }
        ];
	}

	onInitDone()
	{
		super.onInitDone()

		this.messageList.addItem('Source/ListViewItems/MessageListViewItem/MessageListViewItem.lay', this.messageListMockData)

	}

	onActiveDone(isFirst)
	{
		super.onActiveDone(isFirst)

		//TODO:edit here

	}

}

