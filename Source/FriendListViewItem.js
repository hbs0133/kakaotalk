
FriendListViewItem = class FriendListViewItem extends AView
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

	}

	onActiveDone(isFirst)
	{
		super.onActiveDone(isFirst)

		//TODO:edit here

	}

    setData(data)
    {
        const {profileImg, name, profileMessage} = data;

        // this.profileImg.setImage(profileImg);
        // this.name.setText(name);
        // this.profileMessage.setText(profileMessage)

        //프로필 메시지 있을때만
        if(profileMessage == ""){
            this.profileMessage.setStyle("display", "none")
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
}

