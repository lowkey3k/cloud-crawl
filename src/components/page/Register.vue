<template>

    <!--注册页面-->
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">权限管理系统</div>
            <el-form :model="param" :rules="rules" ref="register" label-width="0px" class="ms-content">
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

                <el-form-item prop="captcha">
                    <el-input v-model="param.captcha" placeholder="验证码">
                        <el-button class="captcha" @click="getCaptcha()" slot="append">获取验证码</el-button>
                    </el-input>
                </el-form-item>

                <el-checkbox style="color: #8c939d;font-size: 19px;" @change="btnEnable()" v-model="checked">
                    我已同意《XXX用户使用协议》
                </el-checkbox>

                <div class="register-btn">
                    <el-button type="primary" :disabled="btnChangeEnable" @click="registerSubmit()">注册</el-button>
                </div>
                <p class="login-tips" @click="loginSubmit()">有账号，直接登陆</p>
            </el-form>
        </div>
    </div>
</template>

<script>
    import service from '../../utils/request';

    export default {
        data: function() {
            let checkName = (rule, value, callback) => {
                service.get('user/checkUnique?name=username&value=' + this.param.username).then(function(result) {
                    if (result.result) {
                        return callback(new Error('用户名已存在'));
                    }else {
                        callback();
                    }
                });
            };
            let checkPhone = (rule, value, callback) => {
                service.get('user/checkUnique?name=phone&value=' + this.param.phone).then(function(result) {
                    if (result.result) {
                        return callback(new Error('手机号已注册'));
                    }else {
                        callback();
                    }
                });
            };
            return {
                param: {
                    username: '',
                    password: '',
                    phone: '',
                    captcha: ''
                },
                //按钮禁用
                btnChangeEnable: true
                ,
                checked: false
                ,
                rules: {//rules验证通过后this.$refs.login.validate中valid参数返回true
                    username: [{
                        required: true,
                        message: '请输入用户名',
                        trigger: 'blur'
                    }, {
                        min: 6,
                        message: '用户名不能少于6位'
                    },
                        {
                            validator: checkName,
                            trigger: 'blur'
                        }
                    ],
                    password: [{
                        required: true,
                        message: '请输入密码',
                        trigger: 'blur'
                    }, {
                        min: 6,
                        max: 18,
                        message: '密码在6-21位之间，并且包含英文字母加数字'
                    }, {
                        pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,18}$/,
                        message: '密码必须包含数字和字母两种，且必须为6到18位'
                    }
                    ],
                    phone: [{
                        required: true,
                        message: '请输入正确手机号',
                        trigger: 'blur'
                    }, {
                        pattern: /^1[3-9]\d{9}$/,
                        message: '手机号格式错误'
                    },
                        {
                            validator: checkPhone,
                            trigger: 'blur'
                        }],
                    captcha: [{
                        required: true,
                        message: '请输入验证码',
                        trigger: 'blur'
                    }, {
                        min: 6,
                        message: '请输入正确验证码'
                    }]
                }
            };
        },
        methods: {
            registerSubmit() {
                this.$refs.register.validate(valid => {
                    let vm = this;
                    if (valid) {
                        //注册，成功后跳转到登陆页面去登陆
                        service.post('/register', {
                            phone: this.param.phone,
                            password: this.param.password,
                            username: this.param.username,
                            captcha: this.param.captcha
                        }).then(function(result) {
                            if (result.code === '0') {
                                vm.$message.success('注册成功');
                                vm.$router.push('/login');
                            }
                        });
                    } else {
                        return false;
                    }
                });
            },
            getCaptcha() {
                this.$refs.register.validateField('phone', (valid) => {
                    if (!valid) {
                        let vm = this;
                        //获取验证码
                        service.get('/register/captcha?phone=' + this.param.phone)
                            .then(function(result) {
                                //这里的验证码是后端模拟的，真的验证码在手机或邮箱里
                                vm.$message.success(result.result);
                            });
                    }
                });

                // this.$refs.register.validateField('phone');

            },
            loginSubmit() {
                //跳转登陆页
                this.$router.push('/login');
            },
            btnEnable() {
                if (this.checked === true) {
                    this.btnChangeEnable = false;
                } else {
                    this.btnChangeEnable = true;
                }
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
