import { Card, Icon, Layout, Page, ResourceItem, ResourceList, Select, TextStyle } from '@shopify/polaris';
import { useAppBridge } from '@shopify/app-bridge-react';
import { useCallback, useEffect, useState } from 'react';
import { userLoggedInFetch } from '../../App.jsx';
import { CashDollarMajor, DiscountsMajor, ProductsMajor, StoreMajor } from '@shopify/polaris-icons';
import { Loading } from '../../helper/Loading.jsx';
import { Tab } from './Tab.jsx';

export function Dashboard() {
    const app = useAppBridge();
    const fetch = userLoggedInFetch(app);

    const [loading, setLoading] = useState(true);
    const [dashboardResult, setDashboardResult] = useState(true);
    const [selected, setSelected] = useState('0');

    const getUrlList = async () => {
        let dashboardResult = await fetch('/dashboard-info', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ date_type: parseInt(selected) }),
        }).then((res) => res.json());

        setLoading(false);
        setDashboardResult(dashboardResult);
        console.log(dashboardResult);
    };

    useEffect(async () => {
        await getUrlList();
    }, []);

    useEffect(async () => {
        setSelected(selected);
        await getUrlList();
    }, [selected]);

    const handleSelectChange = useCallback(async (value) => {
        setSelected(value);
    }, []);

    const options = [
        { label: 'Today', value: '0' },
        { label: 'Last 7 days', value: '1' },
        { label: 'Last 30 days', value: '2' },
    ];

    return (
        <Page fullWidth title="Dashboard" primaryAction={<Select label="Date range" options={options} onChange={handleSelectChange} value={selected} />}>
            {loading ? (
                <Loading />
            ) : (
                <div>
                    <Layout>
                        <Layout.Section oneThird>
                            <Card>
                                <ResourceList
                                    resourceName={{ singular: 'customer', plural: 'customers' }}
                                    items={[dashboardResult]}
                                    renderItem={(item) => {
                                        const { id, count_of_followed_store } = item;
                                        return (
                                            <ResourceItem verticalAlignment="center" id={id} media={<Icon color="primary" size="large" name={count_of_followed_store} source={StoreMajor} />}>
                                                <h3>
                                                    <TextStyle variation="strong"># of Stores Followed</TextStyle>
                                                </h3>
                                                <div>{count_of_followed_store}</div>
                                            </ResourceItem>
                                        );
                                    }}
                                />
                            </Card>
                        </Layout.Section>
                        <Layout.Section oneThird>
                            <Card>
                                <ResourceList
                                    resourceName={{ singular: 'customer', plural: 'customers' }}
                                    items={[dashboardResult]}
                                    renderItem={(item) => {
                                        const { id, store_mail_item_send_count } = item;
                                        return (
                                            <ResourceItem verticalAlignment="center" id={id} media={<Icon color="primary" name={store_mail_item_send_count} source={ProductsMajor} />}>
                                                <h3>
                                                    <TextStyle variation="strong"># of Item Send</TextStyle>
                                                </h3>
                                                <div>{store_mail_item_send_count}</div>
                                            </ResourceItem>
                                        );
                                    }}
                                />
                            </Card>
                        </Layout.Section>
                    </Layout>

                    <br />
                    <br />
                    <Layout>
                        <Layout.Section oneThird>
                            <Card>
                                <ResourceList
                                    resourceName={{ singular: 'customer', plural: 'customers' }}
                                    items={[dashboardResult]}
                                    renderItem={(item) => {
                                        const { id, average_price_change_as_rate } = item;
                                        return (
                                            <ResourceItem verticalAlignment="center" id={id} media={<Icon color="primary" size="large" name={average_price_change_as_rate} source={DiscountsMajor} />}>
                                                <h3>
                                                    <TextStyle variation="strong"># of Average Price Change %</TextStyle>
                                                </h3>
                                                <div>{average_price_change_as_rate + ' %'}</div>
                                            </ResourceItem>
                                        );
                                    }}
                                />
                            </Card>
                        </Layout.Section>
                        <Layout.Section oneThird>
                            <Card>
                                <ResourceList
                                    resourceName={{ singular: 'customer', plural: 'customers' }}
                                    items={[dashboardResult]}
                                    renderItem={(item) => {
                                        const { id, average_price_change_as_price } = item;
                                        return (
                                            <ResourceItem verticalAlignment="center" id={id} media={<Icon color="primary" backdrop source={CashDollarMajor} />}>
                                                <h3>
                                                    <TextStyle variation="strong"># of Average Price Change $</TextStyle>
                                                </h3>
                                                <div>{average_price_change_as_price + ' $'}</div>
                                            </ResourceItem>
                                        );
                                    }}
                                />
                            </Card>
                        </Layout.Section>
                    </Layout>

                    <br />
                    <br />
                    <Layout>
                        <Layout.Section oneThird>
                            <Card>
                                <ResourceList
                                    resourceName={{ singular: ' ', plural: 'customers' }}
                                    items={[dashboardResult]}
                                    renderItem={(item) => {
                                        const { id, max_price_change_as_rate_product_title } = item;
                                        return (
                                            <ResourceItem verticalAlignment="center" id={id} media={<Icon color="primary" size="large" name={max_price_change_as_rate_product_title} source={ProductsMajor} />}>
                                                <h3>
                                                    <TextStyle variation="strong">Maximum Changing Price Product</TextStyle>
                                                </h3>
                                                <div>{max_price_change_as_rate_product_title}</div>
                                            </ResourceItem>
                                        );
                                    }}
                                />
                            </Card>
                        </Layout.Section>
                        <Layout.Section oneThird>
                            <Card>
                                <ResourceList
                                    resourceName={{ singular: 'customer', plural: 'customers' }}
                                    items={[dashboardResult]}
                                    renderItem={(item) => {
                                        const { id, max_price_change_as_rate } = item;
                                        return (
                                            <ResourceItem verticalAlignment="center" id={id} media={<Icon color="primary" backdrop source={DiscountsMajor} />}>
                                                <h3>
                                                    <TextStyle variation="strong">Maximum Changing %</TextStyle>
                                                </h3>
                                                <div>{max_price_change_as_rate + ' %'}</div>
                                            </ResourceItem>
                                        );
                                    }}
                                />
                            </Card>
                        </Layout.Section>
                    </Layout>
                    <br />
                    <br />
                    <Card>
                        <Tab selectedDayIndex={selected} />
                    </Card>
                </div>
            )}
        </Page>
    );
}
