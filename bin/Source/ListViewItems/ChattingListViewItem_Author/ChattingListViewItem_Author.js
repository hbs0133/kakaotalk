
ChattingListViewItem_Author = class ChattingListViewItem_Author extends AView
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

    setData(data)
    {
        const {message, sentAt} = data;
        const fommattedTime = this.formatToKoreanTime(sentAt)

        this.sentAt.setText(fommattedTime);
        this.message.setText(message)
        
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

}

