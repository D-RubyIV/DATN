import SignInForm from './SignInForm'

const SignIn = () => {
    return (
        <>
            <div className="mb-8">
                <h3 className="mb-1">Chào mừng trở lại!</h3>
                <p>Vui lòng nhập thông tin đăng nhập của bạn để đăng nhập!</p>
            </div>
            <SignInForm disableSubmit={false} />
        </>
    )
}

export default SignIn
