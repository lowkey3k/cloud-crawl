<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 日志列表
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="query.f_like_module" placeholder="操作模块" class="handle-input mr10">
                </el-input>
                <el-input v-model="query.f_like_action" placeholder="操作" class="handle-input mr10"></el-input>
                <el-input v-model="query.f_like_ip" placeholder="ip" class="handle-input mr10"></el-input>
                <el-input v-model="query.f_like_username" placeholder="用户" class="handle-input mr10"></el-input>

                <el-button style="float: right" type="primary" icon="el-icon-search" @click="handleSearch">搜索
                </el-button>
            </div>

            <el-table
                    :data="tableData"
                    style="width: 100%"
            >
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-form label-position="left" inline class="demo-table-expand">
                            <el-form-item label="模块：">
                                <span>{{ props.row.module }}</span>
                            </el-form-item>
                            <el-form-item label="操作:">
                                <span>{{ props.row.action }}</span>
                            </el-form-item>
                            <el-form-item label="操作描述:">
                                <span>{{ props.row.description }}</span>
                            </el-form-item>
                            <el-form-item label="ip:">
                                <span>{{ props.row.ip }}</span>
                            </el-form-item>
                            <el-form-item label="访问地址:">
                                <span>{{ props.row.url }}</span>
                            </el-form-item>
                            <el-form-item label="访问时间:">
                                <span>{{ parseTime(props.row.requestTime) }}</span>
                            </el-form-item>
                            <el-form-item label="响应时间:">
                                <span>{{ parseTime(props.row.responseTime) }}</span>
                            </el-form-item>
                            <el-form-item label="访问用户:">
                                <span>{{ props.row.username }}</span>
                            </el-form-item>
                            <el-form-item label="请求参数:">
                                <span>{{ props.row.params }}</span>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>

                <el-table-column prop="module" label="模块"></el-table-column>
                <el-table-column prop="action" label="操作"></el-table-column>
                <el-table-column prop="username" label="访问用户"></el-table-column>

                <!--<el-table-column prop="description" label="操作描述"></el-table-column>-->

                <el-table-column prop="ip" label="访问ip"></el-table-column>

                <!--<el-table-column prop="url" label="访问url"></el-table-column>-->

                <el-table-column prop="requestTime" :formatter="requestDateFormat" label="访问时间"></el-table-column>
                <el-table-column prop="responseTime" :formatter="responseDateFormat" label="响应时间"></el-table-column>

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
    </div>
</template>

<script>
    import { fetchData, deleteAccessLog } from '../../api/accessLog';
    import { parseTime } from '../../components/common/util';


    export default {
        name: 'basetable',
        data() {
            return {
                query: {
                    // address: '',
                    pageNo: 1,
                    pageSize: 10,
                    f_like_module: '',
                    f_like_username: '',
                    f_like_action: '',
                    f_like_ip: ''

                },
                tableData: [],
                multipleSelection: [],
                delList: [],
                pageTotal: 0,
                form: {},
                idx: -1,
                id: -1,
                open: false,
                parseTime: parseTime
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
                    this.pageTotal = res.result.total || 50;
                });
            },
            requestDateFormat(row, column) {
                return parseTime(row.requestTime);
            },
            responseDateFormat(row, column) {
                return parseTime(row.responseTime);
            },
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

            // 删除操作
            handleDelete(index, row) {
                // 二次确认删除
                this.$confirm('确定要删除吗？', '提示', {
                    type: 'warning'
                })
                    .then(() => {
                        let vm = this;
                        let param = { 'id': row.id };
                        deleteAccessLog(param).then(function(result) {
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
