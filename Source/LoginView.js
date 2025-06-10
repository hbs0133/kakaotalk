
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
	async onLoginBtnClick(comp, info, e)
	{

        await theApp.qm.sendProcessByName('login', this.getContainerId(), null,
        
            (queryData)=> {
                queryData.printQueryData();
            },

            (queryData) => {
                queryData.printQueryData();

                let blockData = queryData.getBlockData('OutBlock1')
                let status = blockData[0].status


                if(status == "pass") {
                    const navigator = ANavigator.find('navi');
                    AToast.show("로그인 되었습니다.")
                    navigator.goPage('MainTabView')
                }else if( status == "reject"){
                    AToast.show("아이디,비밀번호를 확인해주세요")
                    this.emailInput.setText("")
                    this.passwordInput.setText("")
                }
            }  
        )
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



	onLoginqrbtnClick(comp, info, e)
	{
        theApp.qm.sendProcessByName('test', this.getContainerId(), null,
        
        (queryData)=> {
            queryData.printQueryData();
        },

        (queryData) => {
            queryData.printQueryData();
        }
        
        )
        
	}
}

