
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

	}

	async onInitDone()
	{
		super.onInitDone()

            await theApp.qm.sendProcessByName('chatting', this.getContainerId(), null,
        
            (queryData)=> {

            },

            async (queryData) => {


                this.chattingMockData = await queryData.getBlockData('OutBlock1');
                this.chattingInfo = await queryData.getBlockData('OutBlock2')

               for(const item of this.chattingMockData){
               item.isAuthor ?  await this.chattingList.addItem('Source/ListViewItems/ChattingListViewItem_Author/ChattingListViewItem_Author.lay', [item]):
               await this.chattingList.addItem('Source/ListViewItems/ChattingListViewItem_Other/ChattingListViewItem_Other.lay', [item])
            }

                const {chattingImg, chattingName, chattingCount} = await this.chattingInfo[0]

                this.chattingImg.setImage(chattingImg)
                // this.chattingName.setText(chattingName);
                this.chttingCount.setText(chattingCount)

                this.wrapper.scrollToBottom();
            }  
        )


	}

	onActiveDone(isFirst)
	{
		super.onActiveDone(isFirst)

		

	}


	onXbtnClick(comp, info, e)
	{

		this.getContainer().close();

	}

	async onSendClick(comp, info, e)
	{
        this.sendMessage();
        this.wrapper.scrollToBottom();
	}

	onChattingMessageKeydown(comp, info, e)
	{

         if (e.key === 'Enter') {
            this.sendMessage();
        }
        this.wrapper.scrollToBottom();

	}

    async sendMessage()
    {
        	await theApp.qm.sendProcessByName('sendMessage', this.getContainerId(), null,
        
            (queryData)=> {
                let blockData = queryData.getBlockData('InBlock1')
		        blockData[0].sentAt = new Date().toISOString();
                blockData[0].isAuthor = true

            },

            async (queryData) => {
                // this.newchattingMockData = await queryData.getBlockData('OutBlock1');
                // this.chattingList.removeAllItems();
                this.newMessage = await queryData.getBlockData('OutBlock1');

                this.chattingList.addItem('Source/ListViewItems/ChattingListViewItem_Author/ChattingListViewItem_Author.lay', [this.newMessage])

            //     for(const item of this.newchattingMockData){
            //    item.isAuthor ?  await this.chattingList.addItem('Source/ListViewItems/ChattingListViewItem_Author/ChattingListViewItem_Author.lay', [item]):
            //    await this.chattingList.addItem('Source/ListViewItems/ChattingListViewItem_Other/ChattingListViewItem_Other.lay', [item])
            // }

            this.wrapper.scrollToBottom();
            this.chattingMessage.setText("")

            }  
        )
    }
}

