import { useAppBridge } from '@shopify/app-bridge-react';
import { userLoggedInFetch } from '../../App.jsx';
import { useEffect, useState } from 'react';
import { Card, EmptySearchResult, Icon, IndexTable, Link, Pagination, TextStyle } from '@shopify/polaris';
import { ProductsMajor } from '@shopify/polaris-icons';
import priceWithCurrency from '../../utility/currenctUtility.js';

export function ProductMailHistoryTab({ selectedDayIndex }) {
    const app = useAppBridge();
    const fetch = userLoggedInFetch(app);

    const [loadingUrl, setLoadingUrl] = useState(false);

    const [pageIndex, setPageIndex] = useState(0);
    const [minPageIndex, setMinPageIndex] = useState(true);
    const [maxPageIndex, setMaxPageIndex] = useState(true);

    const getProductMailHistory = async () => {
        setLoadingUrl(true);
        let response = await fetch('/product-mail-history-info', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ date_type: parseInt(selectedDayIndex) }),
        }).then((res) => res.json());
        setLoadingUrl(false);
        setProductMailList(response);
    };

    const [productMailList, setProductMailList] = useState([]);

    useEffect(() => {
        setPage(0);
    }, [productMailList]);

    useEffect(async () => {
        console.log('useEffect logic ran');
        await getProductMailHistory();
    }, [selectedDayIndex]);

    useEffect(async () => {
        await getProductMailHistory();
    }, []);

    const setPage = (index) => {
        let maxIndex = Math.ceil(productMailList.length / 10) - 1;

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

    const rowMarkup =
        productMailList && productMailList.length > 0
            ? productMailList.slice(10 * pageIndex, 10 * pageIndex + 10).map(({ _id, url, website, imageSrc, productTitle, oldValue, newValue, currency }, index) => (
                  <IndexTable.Row id={_id} key={_id} position={index}>
                      <IndexTable.Cell>
                          {imageSrc ? (
                              <img style={{ objectFit: 'fill', height: '5rem', width: '5rem' }} src={imageSrc} />
                          ) : (
                              <div style={{ display: 'flex', height: '5rem', width: '5rem', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                  <Icon color="primary" source={ProductsMajor} />
                              </div>
                          )}
                      </IndexTable.Cell>

                      <IndexTable.Cell>
                          <TextStyle variation="strong">{productTitle}</TextStyle>
                          <br />
                          <TextStyle variation="strong">{website}</TextStyle>
                      </IndexTable.Cell>
                      <IndexTable.Cell>
                          Before Price: <TextStyle variation="strong">{priceWithCurrency(oldValue, currency)}</TextStyle>
                          <br />
                          After Price: <TextStyle variation="strong"> {priceWithCurrency(newValue, currency)}</TextStyle>
                      </IndexTable.Cell>
                      <IndexTable.Cell>
                          <Link url={url} external={true}>
                              Go to Product
                          </Link>
                      </IndexTable.Cell>
                  </IndexTable.Row>
              ))
            : '';

    const resourceName = {
        singular: 'productMail',
        plural: 'productMails',
    };

    const emptyStateMarkup = <EmptySearchResult title={'No product yet'} withIllustration />;

    return (
        <Card>
            <IndexTable emptyState={emptyStateMarkup} loading={loadingUrl} resourceName={resourceName} itemCount={productMailList.length} selectable={false} headings={[{ title: '' }, { title: 'Website' }, { title: 'Prices' }, { title: '' }]}>
                {rowMarkup}
            </IndexTable>

            <div style={{ marginLeft: '45%' }}>
                <Pagination nextTooltip={'Next'} previousTooltip={'Previous'} onPrevious={() => setPage(pageIndex - 1)} onNext={() => setPage(pageIndex + 1)} hasPrevious={!minPageIndex} hasNext={!maxPageIndex} />
            </div>
        </Card>
    );
}
