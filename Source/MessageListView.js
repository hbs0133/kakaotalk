
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

	}

	async onInitDone()
	{
		super.onInitDone()

        //메시지 리스트 가져오기
        await theApp.qm.sendProcessByName('messageList', this.getContainerId(), null,
        
            (queryData)=> {

            },

            (queryData) => {
                this.messageListMockData = queryData.getBlockData('OutBlock1')
		        // this.messageList.addItem('Source/ListViewItems/MessageListViewItem/MessageListViewItem.lay', this.messageListMockData)
            }  
        )



	}

	onActiveDone(isFirst)
	{
		super.onActiveDone(isFirst)

		//TODO:edit here

	}

}

