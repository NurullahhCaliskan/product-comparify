import { useAppBridge } from '@shopify/app-bridge-react';
import { userLoggedInFetch } from '../../App.jsx';
import { useEffect, useState } from 'react';
import { Card, EmptySearchResult, IndexTable, Pagination, Tabs, TextStyle } from '@shopify/polaris';

export function MailHistoryTab({ selectedDayIndex }) {
    const app = useAppBridge();
    const fetch = userLoggedInFetch(app);

    const [loadingUrl, setLoadingUrl] = useState(false);

    const [pageIndex, setPageIndex] = useState(0);
    const [minPageIndex, setMinPageIndex] = useState(true);
    const [maxPageIndex, setMaxPageIndex] = useState(true);

    const getMailHistory = async () => {
        setLoadingUrl(true);
        const response = await fetch('/get-mail-history', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ date_type: parseInt(selectedDayIndex) }),
        }).then((res) => res.json());
        setLoadingUrl(false);
        setMailList(response);
    };

    const [mailList, setMailList] = useState([]);

    useEffect(() => {
        setPage(0);
    }, [mailList]);

    useEffect(async () => {
        await getMailHistory();
    }, []);

    useEffect(async () => {
        console.log('useEffect logic ran');
        await getMailHistory();
    }, [selectedDayIndex]);

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

    const humanReadableTime = (time) => {
        let date = new Date(time);

        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
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
                  </IndexTable.Row>
              ))
            : '';

    const resourceName = {
        singular: 'mail',
        plural: 'mails',
    };

    const emptyStateMarkup = <EmptySearchResult title={'No mail yet'} withIllustration />;

    return (
        <Card>
            <IndexTable emptyState={emptyStateMarkup} loading={loadingUrl} resourceName={resourceName} itemCount={mailList.length} selectable={false} headings={[{ title: 'Sending Date' }, { title: '# of Item Send' }]}>
                {rowMarkup}
            </IndexTable>

            <div style={{ marginLeft: '45%' }}>
                <Pagination nextTooltip={'Next'} previousTooltip={'Previous'} onPrevious={() => setPage(pageIndex - 1)} onNext={() => setPage(pageIndex + 1)} hasPrevious={!minPageIndex} hasNext={!maxPageIndex} />
            </div>
        </Card>
    );
}
