<template>
    <!--登陆页面-->


    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">权限管理系统</div>
            <el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
                <el-form-item prop="username">
                    <el-input v-model="param.username" placeholder="username">
                        <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input
                            type="password"
                            placeholder="password"
                            v-model="param.password"
                            @keyup.enter.native="submitForm()"
                    >
                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>

                <el-checkbox v-model="checked">记住我</el-checkbox>
                <el-link @click="forgetPassword()" class="forget-password">忘记密码？</el-link>


                <div class="login-btn">
                    <el-button type="primary" @click="submitForm()">登录</el-button>
                </div>
                <div class="register-btn">
                    <el-button type="primary" @click="toRegister()">注册</el-button>
                </div>
                <p class="login-tips"></p>
            </el-form>
        </div>
    </div>
</template>
<script>
    import service from '../../utils/request';
    import { login } from '../../api/user';

    export default {
        data: function() {
            return {
                param: {
                    username: '123456',
                    password: '123456'
                },
                checked: false
                ,
                rules: {//rules验证通过后this.$refs.login.validate中valid参数返回true
                    username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
                    password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
                }
            };
        },
        methods: {
            submitForm() {
                this.$refs.login.validate(valid => {
                    var vm = this;
                    if (valid) {
                        let requestUrl='/up/login?password=' + this.param.password + '&username=' + this.param.username;
                        if (this.checked){
                            requestUrl=requestUrl+'&remember-me=true'
                        }
                        service.post(requestUrl)
                            .then(function(result) {
                                if (result.code === '0') {
                                    localStorage.setItem('current_username', vm.param.username);
                                    vm.$router.push('/');
                                }
                            });
                        // login(this.param);

                    } else {
                        vm.$message.error('请输入账号和密码');
                        return false;
                    }
                });
            },
            toRegister() {
                this.$router.push('/register');
            },
            forgetPassword() {

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
        color: white;
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

    .login-btn button {
        width: 40%;
        height: 36px;
        margin-bottom: 10px;
        float: left;
    }

    .register-btn {
        text-align: center;
    }

    .register-btn button {
        width: 40%;
        height: 36px;
        margin-bottom: 10px;
        float: right;
        background-color: white;
        color: rgba(0, 0, 0, 0.75);
    }

    .login-tips {
        font-size: 12px;
        line-height: 30px;
        color: #fff;
        height: 50px;

    }

    .forget-password {
        float: right;
    }
</style>
