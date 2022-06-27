import { useCallback, useEffect, useRef, useState } from 'react';
import { Page, Card, FormLayout, Button, Layout, Modal, IndexTable, TextStyle, Pagination, Icon } from '@shopify/polaris';
import { CircleCancelMinor, CircleTickMinor } from '@shopify/polaris-icons';
import { useAppBridge } from '@shopify/app-bridge-react';
import { userLoggedInFetch } from '../App.jsx';
import mailSend from '../assets/mail-send.webp';

export function DashBoard() {
    const app = useAppBridge();
    const fetch = userLoggedInFetch(app);
    const [loadingUrl, setLoadingUrl] = useState(false);
    const [mailStatusCode, setMailStatusCode] = useState(null);
    const [mailResponse, setMailResponse] = useState(null);

    const [pageIndex, setPageIndex] = useState(0);
    const [minPageIndex, setMinPageIndex] = useState(true);
    const [maxPageIndex, setMaxPageIndex] = useState(true);

    const [modalActive, setModalActive] = useState(false);

    const getMailHistory = async () => {
        setLoadingUrl(true);
        const response = await fetch('/get-mail-history').then((res) => res.json());
        setLoadingUrl(false);
        setMailList(response);
    };

    const [mailList, setMailList] = useState(getMailHistory);

    useEffect(() => {
        setPage(0);
    }, [mailList]);

    const skipToContentRef = useRef(null);

    const skipToContentTarget = <a id="SkipToContentTarget" ref={skipToContentRef} tabIndex={-1} />;

    const humanReadableTime = (time) => {
        let date = new Date(time);

        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    };

    const sendTestMail = async () => {
        setModalActive(true);
        setLoadingUrl(true);

        try {
            const response = await fetch('/send-test-mail');

            setMailResponse((await response.json()).result);
            setMailStatusCode(response.status);

            await getMailHistory();
        } catch (error) {
            setMailResponse('Something went wrong. Please try again');
            setMailStatusCode(500);
        }
        setLoadingUrl(false);
    };

    const getProductList2 = async () => {
        const response = await fetch('/get-user-products');
    };

    const getProductList = async () => {
        const count = await fetch('/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: 'exampletitle',
            }),
        }).then((res) => res.json());
    };

    const toggleModalActive = useCallback(() => setModalActive((modalActive) => !modalActive), []);

    const testMailMarkup = (
        <Modal loading={loadingUrl} open={modalActive} onClose={toggleModalActive} title={loadingUrl ? 'Test Mail Sending Please Wait' : mailResponse}>
            <Modal.Section>
                <FormLayout>
                    <img src={mailSend} />
                </FormLayout>
            </Modal.Section>
        </Modal>
    );

    const setPage = (index) => {
        let maxIndex = Math.ceil(mailList.length / 10) - 1;

        if (index < 0) {
            index = 0;
        }

        if (index > maxIndex) {
            index = maxIndex;
        }

        if (index === 0) {
            setMinPageIndex(true);
        } else {
            setMinPageIndex(false);
        }

        if (index === maxIndex) {
            setMaxPageIndex(true);
        } else {
            setMaxPageIndex(false);
        }

        setPageIndex(index);
    };

    const resourceName = {
        singular: 'website',
        plural: 'websites',
    };

    const rowMarkup =
        mailList && mailList.length > 0
            ? mailList.slice(10 * pageIndex, 10 * pageIndex + 10).map(({ createDateTime, status, cachedAlarm, _id }, index) => (
                  <IndexTable.Row id={_id} key={_id} position={index}>
                      <IndexTable.Cell>
                          <TextStyle variation="strong">{humanReadableTime(createDateTime)}</TextStyle>
                      </IndexTable.Cell>
                      <IndexTable.Cell>
                          <TextStyle variation="strong">{cachedAlarm.length}</TextStyle>
                      </IndexTable.Cell>
                      <IndexTable.Cell>
                          <TextStyle variation="strong">
                              <Icon source={status ? CircleTickMinor : CircleCancelMinor} />
                          </TextStyle>
                      </IndexTable.Cell>
                  </IndexTable.Row>
              ))
            : '';

    return (
        <Page title="Dashboard">
            {testMailMarkup}
            <Layout>
                {skipToContentTarget}

                <Layout.AnnotatedSection title="Mail" description="Sending Mail Details">
                    <Card>
                        <Button primary onClick={() => getProductList()}>
                            {' '}
                            Get Product List TEST
                        </Button>

                        <IndexTable loading={loadingUrl} resourceName={resourceName} itemCount={2} selectable={false} headings={[{ title: 'Sending Date' }, { title: 'Product Count' }, { title: 'Mail Status' }]}>
                            {rowMarkup}
                        </IndexTable>

                        <div style={{ marginLeft: '40%' }}>
                            <Pagination nextTooltip={'Next'} previousTooltip={'Previous'} onPrevious={() => setPage(pageIndex - 1)} onNext={() => setPage(pageIndex + 1)} hasPrevious={!minPageIndex} hasNext={!maxPageIndex} />
                        </div>
                    </Card>

                    <Button primary onClick={() => sendTestMail()}>
                        {' '}
                        Send Test Mail
                    </Button>
                </Layout.AnnotatedSection>
            </Layout>
        </Page>
    );
}
