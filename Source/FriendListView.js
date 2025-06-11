
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
	}

	async onInitDone()
	{
		super.onInitDone()

        // 친구목록 가져오기
        await theApp.qm.sendProcessByName('friendList', this.getContainerId(), null,
        
            (queryData)=> {
            },

            (queryData) => {
                
                this.friendListMockData = queryData.getBlockData('OutBlock1')
                // this.friendList.addItem('Source/ListViewItems/FriendListViewItem/FriendListViewItem.lay', this.friendListMockData)
            }  
        )


	}

	onActiveDone(isFirst)
	{
		super.onActiveDone(isFirst)

		//TODO:edit here

	}

}

