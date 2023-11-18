import React, { useEffect, useState } from 'react';
import { Button, Modal, List, Avatar, Skeleton, Card, Form, Input } from 'antd';
import {useNavigate} from "react-router-dom";

const count = 3;
const fakeDataUrl = `https://randomuser.me/api/?results=${count}&inc=name,gender,email,nat,picture&noinfo`;
const SyncList = () => {
    const [initLoading, setInitLoading] = useState(true);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [list, setList] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isLogoutConfirmVisible, setIsLogoutConfirmVisible] = useState(false);
    const [isNewSyncModalVisible, setIsNewSyncModalVisible] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(fakeDataUrl)
            .then((res) => res.json())
            .then((res) => {
                setInitLoading(false);
                setData(res.results);
                setList(res.results);
            });
    }, []);
    const onLoadMore = () => {
        setLoading(true);
        setList(
            data.concat(
                [...new Array(count)].map(() => ({
                    loading: true,
                    name: {},
                    picture: {},
                })),
            ),
        );
        fetch(fakeDataUrl)
            .then((res) => res.json())
            .then((res) => {
                const newData = data.concat(res.results);
                setData(newData);
                setList(newData);
                setLoading(false);
                // Resetting window's offsetTop so as to display react-virtualized demo underfloor.
                // In real scene, you can using public method of react-virtualized:
                // https://stackoverflow.com/questions/46700726/how-to-use-public-method-updateposition-of-react-virtualized
                window.dispatchEvent(new Event('resize'));
            });
    };
    const loadMore =
        !initLoading && !loading ? (
            <div
                style={{
                    textAlign: 'center',
                    marginTop: 12,
                    height: 32,
                    lineHeight: '32px',
                }}
            >
                <Button onClick={onLoadMore}>loading more</Button>
            </div>
        ) : null;

    const showSyncModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const confirmLogout = () => {
        Modal.confirm({
            title: '确认要登出吗？',
            content: '如果登出，您将需要重新登录。',
            onOk() {
                console.log('Logged out');
                navigate("/")

                // 实现登出逻辑，例如清除token，跳转到登录页等
            },
        });
    };

    // 显示新的同步弹窗
    const showNewSyncModal = () => {
        setIsNewSyncModalVisible(true);
    };

    // 处理新的同步表单提交
    const handleNewSyncSubmit = () => {
        // 提交表单数据的逻辑
        console.log('表单数据提交');
        setIsNewSyncModalVisible(false); // 提交后关闭弹窗
    };

    // 取消新的同步操作
    const handleNewSyncCancel = () => {
        setIsNewSyncModalVisible(false);
    };


    return (
        <>
            <Card style={{ marginBottom: '16px' }}> {/* 卡片样式的容器 */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px' }}>
                    <Button type="primary" onClick={showSyncModal}>同步管理</Button>
                    <Button type="primary" onClick={confirmLogout}>登出</Button>
                </div>

                <Modal
                    title="新增同步"
                    visible={isNewSyncModalVisible}
                    onOk={handleNewSyncSubmit}
                    onCancel={handleNewSyncCancel}
                    footer={[
                        <Button key="back" onClick={handleNewSyncCancel}>
                            取消
                        </Button>,
                        <Button key="submit" type="primary" onClick={handleNewSyncSubmit}>
                            保存
                        </Button>,
                    ]}
                >
                    <Form
                        name="newSyncForm"
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 20 }}
                    >
                        <Form.Item
                            label="域名"
                            name="domain"
                            rules={[{ required: true, message: '请输入域名!' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="密钥"
                            name="key"
                            rules={[{ required: true, message: '请输入密钥!' }]}
                        >
                            <Input.Password />
                        </Form.Item>
                        <Form.Item
                            label="名称"
                            name="name"
                            rules={[{ required: true, message: '请输入名称!' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Form>
                </Modal>

                <Modal title="同步管理" visible={isModalVisible}
                       onOk={handleOk}
                       onCancel={handleCancel}
                       footer={[
                    <Button key="back" onClick={handleCancel}>
                        取消
                    </Button>,
                    <Button key="submit" type="primary" onClick={showNewSyncModal}>
                        新增
                    </Button>,
                ]}>
                    {
                        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                            {/* 如果有其它内容，确保它们也设置了宽度为100% */}
                            <List
                                className="demo-config-list"
                                loading={initLoading}
                                itemLayout="horizontal"
                                dataSource={list}
                                renderItem={(item) => (
                                    <List.Item style={{ padding: '10px', width: '100%' }}> {/* 确保List.Item也是100%宽度 */}
                                        <Skeleton avatar title={false} loading={item.loading} active style={{ width: '100%' }}> {/* Skeleton也是100%宽度 */}
                                            <List.Item.Meta />
                                            <div style={{ display: 'flex', width: '100%' }}> {/* 这里已经设置了宽度为100% */}
                                                <div style={{ flex: 3, textAlign: 'left' }}>有道云笔记</div>
                                                <div style={{ flex: 4, textAlign: 'center' }}>5034dfsldf454</div>
                                                <div style={{ flex: 3, textAlign: 'right' }}>网页笔记</div>
                                            </div>
                                        </Skeleton>
                                    </List.Item>
                                )}
                            />
                        </div>}
                </Modal>

                <List
                    className="demo-loadmore-list"
                    loading={initLoading}
                    itemLayout="horizontal"
                    loadMore={loadMore}
                    dataSource={list}
                    renderItem={(item) => (
                        <List.Item
                            actions={[<a key="list-loadmore-more">more</a>]}
                        >
                            <Skeleton avatar title={false} loading={item.loading} active>
                                <List.Item.Meta
                                    avatar={<Avatar src={item.picture.large} />}
                                    title="有道云笔记"
                                />
                                <div style={{ display: 'flex', width: '80%' }}>
                                    <div style={{ flex: 3, textAlign: 'left' }}>https://www.baidu.com</div>
                                    <div style={{ flex: 4, textAlign: 'center' }}>2023-10-11 23:59:59</div>
                                    <div style={{ flex: 3, textAlign: 'right' }}>这篇文章主要讲述了一下一些内容</div>
                                </div>
                            </Skeleton>
                        </List.Item>
                    )}
                />
            </Card>
        </>
    );
};
export default SyncList;