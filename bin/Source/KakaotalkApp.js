
KakaotalkApp = class KakaotalkApp extends AApplication
{
	constructor()
	{
		super()

		//TODO:edit here

        this.serverUrl = 'http://127.0.0.1:3000/users/';

        this.qm = null;

	}

	onReady()
	{
		super.onReady();

        const navigator = new ANavigator('navi', null);

        navigator.registerPage('Source/Views/LoginView/LoginView.lay', 'LoginPage');
        navigator.registerPage('Source/Views/MainTabView/MainTabView.lay', 'MainTabView')

        navigator.goPage('MainTabView')

        this.connectServer();

	}

	unitTest(unitUrl)
	{
		//TODO:edit here

		this.onReady()

		super.unitTest(unitUrl)
	}

    connectServer()
    {
        this.qm = new WebQueryManager();

        let nio = new HttpIO(this.qm);
        this.qm.setNetworkIo(nio);

        this.qm.startManager(this.serverUrl);
    }

}

