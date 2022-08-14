import { useCallback, useState } from 'react';
import { Avatar, Banner, Button, Card, Icon, IndexTable, Page, RangeSlider, TextStyle, Toast, Tooltip } from '@shopify/polaris';
import { QuestionMarkInverseMajor } from '@shopify/polaris-icons';
import { userLoggedInFetch } from '../App';
import { useAppBridge } from '@shopify/app-bridge-react';
import { Loading } from '../helper/Loading.jsx';
import setAlertGif from '../assets/info/setAlert.gif';

export function Alarm() {
    const app = useAppBridge();
    const fetch = userLoggedInFetch(app);

    //toast
    const [activeToast, setActiveToast] = useState(false);
    const [toastContent, setToastContent] = useState({ data: '', error: false });
    const toggleActive = useCallback(() => setActiveToast((activeToast) => !activeToast), []);
    const toastMarkup = activeToast ? <Toast content={toastContent.data} error={toastContent.error} onDismiss={toggleActive} /> : null;

    const [loadingUrl, setLoadingUrl] = useState(false);
    const [loadingPage, setLoadingPage] = useState(true);

    const getUrlList = async () => {
        setLoadingUrl(true);
        const response = await fetch('/user-crawl-url').then((res) => res.json());

        setUrlList(response);

        setLoadingUrl(false);
        setLoadingPage(false);
    };

    const [urlList, setUrlList] = useState(getUrlList);

    const radioButtonKeyListener = async (item) => {
        console.log(item);

        if (loadingUrl) {
            return;
        }

        setLoadingUrl(true);

        try {
            let response = await fetch('/user-crawl-url', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    url: item.website,
                    alarm: item.alarm,
                    value: item.value,
                }),
            });

            const jsonValue = await response.json(); // Get JSON value from the

            setToastContent({ data: jsonValue.data, error: !response.ok });
            setActiveToast(true);
        } catch (error) {
            setToastContent({ data: 'data', error: true });
            setActiveToast(true);
        }

        await getUrlList();
    };
    const updateAlarm = async (item) => {
        if (loadingUrl) {
            return;
        }

        setLoadingUrl(true);

        try {
            let response = await fetch('/user-crawl-url', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    url: item.website,
                    alarm: !item.alarm,
                    value: item.value,
                }),
            });

            const jsonValue = await response.json(); // Get JSON value from the

            if (item.alarm) {
                setToastContent({ data: 'Deactivated successfully', error: !response.ok });
            } else {
                setToastContent({ data: 'Activated successfully', error: !response.ok });
            }

            setActiveToast(true);
        } catch (error) {
            setToastContent('error');
            setActiveToast(true);
        }

        await getUrlList();
    };

    const [rangeValue, setRangeValue2] = useState([{ myValue: 10 }]);

    const setRangeValue = (e, index) => {
        setRangeValue2([{ myValue: e }]);

        let newUrlList = urlList;
        newUrlList[index].value = e;

        setUrlList(newUrlList);
    };
    const resourceName = {
        singular: 'website',
        plural: 'websites',
    };

    const suffixStyles = {
        minWidth: '24px',
        textAlign: 'right',
    };

    const rowMarkup =
        urlList && urlList.length > 0
            ? urlList.map(({ id, website, websites, location, alarm, amountSpent, value }, index) => (
                  <IndexTable.Row id={id} key={id} position={index}>
                      <IndexTable.Cell>
                          <Avatar customer size="medium" name={website} source={websites && websites.faviconUrl ? websites.faviconUrl : 'https://polaris.shopify.com/icons/DomainsMajor.svg'} />
                      </IndexTable.Cell>
                      <IndexTable.Cell>
                          <TextStyle variation="strong">{website}</TextStyle>
                      </IndexTable.Cell>
                      <IndexTable.Cell>
                          <div onClickCapture={() => radioButtonKeyListener(urlList[index])}>
                              <RangeSlider min={1} max={100} value={value} onChange={(e) => setRangeValue(e, index)} suffix={<p style={suffixStyles}>{value}</p>} output disabled={!alarm} />
                          </div>
                      </IndexTable.Cell>
                      <IndexTable.Cell>
                          <Button onClick={() => updateAlarm(urlList[index])} primary={!alarm} secondary={alarm}>
                              {!alarm ? 'Activated' : 'Deactivated'}
                          </Button>
                      </IndexTable.Cell>
                      <IndexTable.Cell>{amountSpent}</IndexTable.Cell>
                  </IndexTable.Row>
              ))
            : '';

    return (
        <Page
            title="Set Alarm"
            titleMetadata={
                <Tooltip
                    content={
                        <img
                            alt=""
                            width="100%"
                            height="100%"
                            style={{
                                objectFit: 'cover',
                                objectPosition: 'center',
                            }}
                            src={setAlertGif}
                        />
                    }
                >
                    <Icon source={QuestionMarkInverseMajor} color="base" />
                </Tooltip>
            }
            subtitle="Set alert % of each website. When you enter the alarm value, the value and above changes are sent as an e-mail."
        >
            {toastMarkup}
            {loadingPage ? (
                <Loading />
            ) : (
                <div>
                    <Banner title="Alarm system working every 12:00AM GMT+1. Mail will be sent the next day." status="warning" />
                    <br />
                    <Card>
                        <IndexTable loading={loadingUrl} resourceName={resourceName} itemCount={urlList?.length} selectable={false} headings={[{ title: '' }, { title: 'Website' }, { title: 'Min Price Change%' }, { title: 'Alarm Status' }]}>
                            {rowMarkup}
                        </IndexTable>
                    </Card>
                </div>
            )}
        </Page>
    );
}
