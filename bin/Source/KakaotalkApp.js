
KakaotalkApp = class KakaotalkApp extends AApplication
{
	constructor()
	{
		super()

		//TODO:edit here

	}

	onReady()
	{
		super.onReady();

        const navigator = new ANavigator('navi', null);

        navigator.registerPage('Source/Views/LoginView/LoginView.lay', 'LoginPage');
        navigator.registerPage('Source/Views/MainTabView/MainTabView.lay', 'MainTabView')

        navigator.goPage('MainTabView')

	}

	unitTest(unitUrl)
	{
		//TODO:edit here

		this.onReady()

		super.unitTest(unitUrl)
	}

}

