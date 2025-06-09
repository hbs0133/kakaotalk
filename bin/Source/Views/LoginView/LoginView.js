
LoginView = class LoginView extends AView
{
	constructor()
	{
		super()

        //유효성 검사를 위한 속성
		this.isEmailValid = false;
        this.isPasswordValid = false;

	}

	init(context, evtListener)
	{
		super.init(context, evtListener)

		//TODO:edit here

	}

	onInitDone()
	{
		super.onInitDone()

        //버튼 초기 비활성화
        this.loginBtn.enable(false)


	}

	onActiveDone(isFirst)
	{
		super.onActiveDone(isFirst)

		//TODO:edit here



	}


    //로그인 버튼 클릭
	onLoginBtnClick(comp, info, e)
	{

        const navigator = ANavigator.find('navi');

        navigator.goPage('FriendListPage')

	}


    //이메일 유효성 검사
	onEmailInputChange(comp, info, e)
	{

		const email = this.emailInput.getText();

       email ? this.isEmailValid = true : this.isEmailValid = false

        this.isValidLogin()

	}

    //패스워드 유효성 검사
	onPasswordInputChange(comp, info, e)
	{

		 const password = this.passwordInput.getText();

         password ? this.isPasswordValid = true : this.isPasswordValid = false

        this.isValidLogin()

         
	}

    //버튼 활성화 비활성화 함수
    isValidLogin()
    {
        this.isEmailValid && this.isPasswordValid ? this.loginBtn.enable(true) : this.loginBtn.enable(false)
    }


}

