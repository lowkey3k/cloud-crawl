<template>

    <!--注册页面-->
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">cloud-rbac权限管理系统</div>
            <el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
                <el-form-item prop="username">
                    <el-input v-model="param.username" placeholder="用户名">
                        <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                    </el-input>
                </el-form-item>

                <el-form-item prop="password">
                    <el-input
                            type="password"
                            placeholder="密码（8-20个字符组成，区分大小写）"
                            v-model="param.password"
                            @keyup.enter.native="submitForm()"
                    >
                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>

                <el-form-item prop="phone">
                    <el-input v-model="param.phone" placeholder="填写常用手机号">
                        <el-button slot="prepend" icon="el-icon-lx-phone">中国大陆</el-button>
                    </el-input>
                </el-form-item>

                <el-form-item prop="phone">
                    <el-input v-model="param.captcha" placeholder="验证码">
                        <el-button class="captcha" @click="getCaptcha()" slot="append">获取验证码</el-button>
                    </el-input>
                </el-form-item>

                <div class="register-btn">
                    <el-button type="primary" @click="registerSubmit()">注册</el-button>
                </div>
                <p class="login-tips" @click="loginSubmit()">有账号，直接登陆</p>
            </el-form>
        </div>
    </div>
</template>

<script>
    export default {
        data: function() {
            return {
                param: {
                    username: '',
                    password: '',
                    phone: '',
                    captcha: ''
                },
                rules: {//rules验证通过后this.$refs.login.validate中valid参数返回true
                    username: [{ required: true, message: '请输入用户名', trigger: 'blur' }, { min: 5 }],
                    password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
                    phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }, { min: 11, max: 11 }]
                }
            };
        },
        methods: {
            registerSubmit() {
                this.$refs.login.validate(valid => {
                    if (valid) {

                        this.$message.success('登录成功');
                        localStorage.setItem('ms_username', this.param.username);
                        this.$router.push('/');
                    } else {
                        this.$message.error('请输入账号和密码');
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            getCaptcha() {

                //获取验证码
                this.$alert("123456");

            },
            loginSubmit() {

                //跳转登陆页
                this.$router.push("/login");

            }

        }
    };
</script>

<style scoped>
    .login-wrap {
        position: relative;
        width: 100%;
        height: 100%;
        background-image: url(../../assets/img/login-bg.jpg);
        background-size: 100%;
    }

    .ms-title {
        width: 100%;
        line-height: 80px;
        text-align: center;
        font-size: 20px;
        color: #fff;
        border-bottom: 1px solid #ddd;
    }

    .ms-login {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 450px;
        margin: -190px 0 0 -175px;
        border-radius: 5px;
        background: rgba(255, 255, 255, 0.3);
        overflow: hidden;
    }

    .ms-content {
        padding: 30px 30px;
    }

    .login-btn {
        text-align: center;
    }

    .register-btn {
        text-align: center;
    }

    .register-btn button {
        width: 100%;
        height: 36px;
        margin-bottom: 10px;
        float: left;
    }

    .login-btn button {
        width: 40%;
        height: 36px;
        margin-bottom: 10px;
        float: right;
        background-color: white;
        color: rgba(60, 63, 65, 0.73);
    }

    .login-tips {
        font-size: 12px;
        line-height: 30px;
        height: 50px;
        float: right;
        cursor: pointer;
        color: #20a0ff;
    }

    .captcha {
        color: #20a0ff;
        background-color: #00d1b2;
    }
</style>
