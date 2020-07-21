<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 项目列表
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button
                        type="primary"
                        icon="el-icon-plus"
                        class="handle-del mr10"
                        @click="handleAdd"
                >添加项目
                </el-button>
                <el-input v-model="query.f_like_clientId" placeholder="客户端id" class="handle-input mr10">
                </el-input>
                <el-button style="float: right" type="primary" icon="el-icon-search" @click="handleSearch">搜索
                </el-button>
            </div>

            <el-table
                    :data="tableData"
                    style="width: 100%"
            >
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-form label-position="left" label-width="200px" inline class="demo-table-expand">
                            <el-form-item label="客户端ID：">
                                <span>{{ props.row.clientId }}</span>
                            </el-form-item>
                            <!--<el-form-item label="客户端密钥:">-->
                            <!--<span>{{ props.row.clientSecret }}</span>-->
                            <!--</el-form-item>-->
                            <el-form-item label="回调URL:">
                                <span>{{ props.row.webServerRedirectUri }}</span>
                            </el-form-item>
                            <el-form-item label="授权范围:">
                                <span>{{ props.row.scope }}</span>
                            </el-form-item>
                            <el-form-item label="授权类型:">
                                <span>{{ props.row.authorizedGrantTypes }}</span>
                            </el-form-item>
                            <el-form-item label="accessToken过期时间:">
                                <span>{{ props.row.accessTokenValidity }}</span>
                            </el-form-item>
                            <el-form-item label="refreshToken过期时间:">
                                <span>{{ props.row.refreshTokenValidity}}</span>
                            </el-form-item>
                            <el-form-item label="是否自动授权:">
                                <span>{{ props.row.autoapprove }}</span>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>

                <el-table-column prop="clientId" label="客户端ID"></el-table-column>
                <!--<el-table-column prop="clientSecret" label="密钥"></el-table-column>-->
                <el-table-column prop="authorizedGrantTypes" label="授权类型"></el-table-column>

                <!--<el-table-column prop="description" label="操作描述"></el-table-column>-->

                <el-table-column prop="webServerRedirectUri" label="重定向地址"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">

                        <el-button
                                type="text"
                                icon="el-icon-delete"
                                class="red"
                                @click="handleDelete(scope.$index, scope.row)"
                        >删除
                        </el-button>
                        <image src="../../assets/logo.png"></image>
                    </template>
                </el-table-column>
            </el-table>


            <div class="pagination">
                <el-pagination
                        background
                        layout="total, prev, pager, next"
                        :current-page="query.pageNo"
                        :page-size="query.pageSize"
                        :total="pageTotal"
                        @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>


        <!-- 添加弹出框 -->
        <el-dialog title="编辑" :visible.sync="addVisible" width="35%">
            <el-form ref="addForm" :model="form" :rules="addRules" label-width="160px">
                <el-form-item prop="clientId" label="客户端ID">
                    <el-input v-model="form.clientId"></el-input>
                </el-form-item>
                <el-form-item prop="clientSecret" label="客户端密钥">
                    <el-input v-model="form.clientSecret"></el-input>
                </el-form-item>
                <!--<el-form-item label="授权范文">-->
                <!--<el-select placeholder="资源类型" @change="changeSelect" v-model="permissionCode">-->
                <!--<el-option v-for="item in permissionTypes" :key="item.code" :label="item.name"-->
                <!--:value="item.code">-->
                <!--</el-option>-->
                <!--</el-select>-->
                <!--</el-form-item>-->
                <el-form-item label="授权范围">
                    <el-input v-model="form.scope"></el-input>
                </el-form-item>
                <el-form-item label="授权类型">
                    <el-input v-model="form.authorizedGrantTypes"></el-input>
                </el-form-item>

                <el-form-item label="回调URL">
                    <el-input v-model="form.webServerRedirectUri"></el-input>
                </el-form-item>
                <el-form-item label="accessToken过期时间:">
                    <el-input v-model="form.accessTokenValidity"></el-input>
                </el-form-item>
                <el-form-item label="refreshToken过期时间:">
                    <el-input v-model="form.refreshTokenValidity"></el-input>
                </el-form-item>
                <el-form-item label="是否自动授权:">
                    <el-input v-model="form.autoapprove"></el-input>
                </el-form-item>


            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addVisible = false">取 消</el-button>
                <el-button type="primary" @click="addPermission">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {fetchData, deletePorject, checkClientId} from '../../api/project';
    import {parseTime} from '../../components/common/util';


    export default {
        name: 'basetable',
        data() {
            return {
                query: {
                    // address: '',
                    pageNo: 1,
                    pageSize: 10,
                    f_like_clientId: '',
                    f_like_username: '',
                    f_like_action: '',
                    f_like_ip: ''

                },
                tableData: [],
                addVisible: false,
                multipleSelection: [],
                delList: [],
                pageTotal: 0,
                form: {},
                idx: -1,
                id: -1,
                open: false,
                parseTime: parseTime,
                addRules: {//rules验证通过后this.$refs.login.validate中valid参数返回true
                    clientId: [{required: true, message: '请输入客户端标识', trigger: 'blur'}
                        , {
                            validator: this.checkClientId,
                            trigger: 'blur'
                        }
                    ],
                    clientSecret: [{required: true, message: '请输入客户端密钥', trigger: 'blur'},
                        {
//                        validator: checkSign,
                            trigger: 'blur'
                        }]
                }
            };
        },
        created() {
            this.getData();
        },
        methods: {
            // 获取 easy-mock 的模拟数据
            getData() {
                fetchData(this.query).then(res => {
                    console.log(res);
                    this.tableData = res.result.records;
                    this.pageTotal = res.result.total || 0;
                });
            },
            checkClientId(rule, value, callback) {
                let param={

                }
                checkClientId().then(function (result) {
                    if (result.result) {
                        return callback(new Error('资源已存在'));
                    } else {
                        callback();
                    }
                });
            }
            ,
            // 触发搜索按钮
            handleSearch() {
                // this.$set(this.query,"pageNo",1);
                this.$set(this.query);
                this.getData();
            },// 触发搜索按钮
            handleDetail(index, row) {
                // this.$set(this.query,"pageNo",1);
                this.open = true;
                this.form = row;
            },
            handleAdd() {
                this.addVisible = true;
                //每次都初始化为空
                this.form = {};
            },
            // 保存
            addPermission() {
                this.$refs.addForm.validate(validate => {
                    if (validate) {
                        let vm = this;
                        addPermission(this.form).then(function (res) {
                            if (res.code === '0') {
                                vm.$message.success('添加成功');
                                vm.addVisible = false;
                                vm.getData();
                            }
                        });
                    } else
                        return false;
                });
            },
            // 删除操作
            handleDelete(index, row) {
                // 二次确认删除
                this.$confirm('确定要删除吗？', '提示', {
                    type: 'warning'
                })
                    .then(() => {
                        let vm = this;
                        let param = {'id': row.id};
                        deletePorject(param).then(function (result) {
                            if (result.code === '0') {
                                vm.$message.success('删除成功');
                                vm.tableData.splice(index, 1);
                            }
                        });
                    })
                    .catch(() => {
                    });
            },
            // 多选操作
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            delAllSelection() {
                const length = this.multipleSelection.length;
                let str = '';
                this.delList = this.delList.concat(this.multipleSelection);
                for (let i = 0; i < length; i++) {
                    str += this.multipleSelection[i].name + ' ';
                }
                this.$message.error(`删除了${str}`);
                this.multipleSelection = [];
            },
            // 分页导航
            handlePageChange(val) {
                this.$set(this.query, 'pageNo', val);
                this.getData();
            }
        }
    };
</script>

<style>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 200px;
        display: inline-block;
    }

    .table {
        width: 100%;
        font-size: 14px;
    }

    .red {
        color: #ff0000;
    }

    .mr10 {
        margin-right: 10px;
    }

    .table-td-thumb {
        display: block;
        margin: auto;
        width: 40px;
        height: 40px;
    }

    .demo-table-expand {
        font-size: 0;
    }

    .demo-table-expand label {
        width: 90px;
        color: #99a9bf;
    }

    .demo-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 50%;
    }
</style>
