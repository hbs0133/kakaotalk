
FriendListView = class FriendListView extends AView
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

        this.friendListMockData = [
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


	}

	async onInitDone()
	{
		super.onInitDone()

	await this.friendList.addItem('Source/ListViewItems/FriendListViewItem/FriendListViewItem.lay', this.friendListMockData)

	}

	onActiveDone(isFirst)
	{
		super.onActiveDone(isFirst)

		//TODO:edit here

	}

}

