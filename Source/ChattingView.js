
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
            //기존 채팅,채팅정보 가져오기
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

    //전송버튼클릭
	async onSendClick(comp, info, e)
	{
        this.sendMessage();
	}

    //엔터키 이벤트
	onChattingMessageKeydown(comp, info, e)
	{
            
         if (e.key === 'Enter') {
            this.sendMessage();
        }

	}

    // 메시지 보내기함수
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

               await this.chattingList.addItem('Source/ListViewItems/ChattingListViewItem_Author/ChattingListViewItem_Author.lay', [this.newMessage])

            //     for(const item of this.newchattingMockData){
            //    item.isAuthor ?  await this.chattingList.addItem('Source/ListViewItems/ChattingListViewItem_Author/ChattingListViewItem_Author.lay', [item]):
            //    await this.chattingList.addItem('Source/ListViewItems/ChattingListViewItem_Other/ChattingListViewItem_Other.lay', [item])
            // }

            this.chattingMessage.setText("")
            this.wrapper.scrollToBottom();

            }  
        )
    }
}

