
MainTabView = class MainTabView extends AView
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

		this.rbm = new RadioBtnManager(this);
        
        this.onClickTab(this.friendListTab)

	}

	onActiveDone(isFirst)
	{
		super.onActiveDone(isFirst)

		//TODO:edit here

	}


    // 탭클릭 함수
     onClickTab(comp, info, e)
	{
        console.log(comp)

		const componentId = comp.getComponentId();

        this.rbm.selectButton(comp);
        this.tabView.selectTabById(componentId) ;

	}
}

