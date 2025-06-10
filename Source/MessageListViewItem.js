
MessageListViewItem = class MessageListViewItem extends AView
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

	onInitDone()
	{
		super.onInitDone()

		//TODO:edit here

	}

	onActiveDone(isFirst)
	{
		super.onActiveDone(isFirst)

		//TODO:edit here

	}

    formatToKoreanTime(isoString) {
    const date = new Date(isoString);
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');

    const isAM = hours < 12;
    const period = isAM ? '오전' : '오후';

    if (hours === 0) {
        hours = 12; 
    } else if (hours > 12) {
        hours -= 12;
    }

    return `${period} ${hours}:${minutes}`;
    }

    setData(data)
    {
        const {messageImg, name, resentMessage , resentMessageSentAt , notificationCount  } = data;
        const fommattedTime = this.formatToKoreanTime(resentMessageSentAt)

        this.messageImg.setImage(messageImg);
        this.name.setText(name);
        this.resentMessage.setText(resentMessage);
        this.resentMessageSentAt.setText(fommattedTime);
        this.notificationCount.setText(notificationCount);


        if(notificationCount == 0){
            this.notificationCount.setStyle("opacity","0")
        }

    }


	onContainerActionenter(comp, info, e)
	{

		this.container.setStyle("backgroundColor","#f5f5f5")

	}

	onContainerActionleave(comp, info, e)
	{

		this.container.setStyle("backgroundColor","#fff")

	}

	onItemDblclick(comp, info, e)
	{

        const window = new AWindow('chatting');
        window.openFull('Source/Views/ChattingView/ChattingView.lay')

	}
}


