import { useAppBridge } from '@shopify/app-bridge-react';
import { userLoggedInFetch } from '../../App.jsx';
import { useEffect, useState } from 'react';
import { Card, EmptySearchResult, Icon, IndexTable, Link, Pagination, TextStyle } from '@shopify/polaris';
import { ProductsMajor } from '@shopify/polaris-icons';

export function ProductMailHistoryTab() {
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
            body: JSON.stringify({ date_type: 3 }),
        }).then((res) => res.json());
        setLoadingUrl(false);
        setProductMailList(response);
    };

    const [productMailList, setProductMailList] = useState([]);

    useEffect(() => {
        setPage(0);
    }, [productMailList]);

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

    const priceWithCurrency = (price, currency) => {
        return new Intl.NumberFormat('de-DE', { style: 'currency', currency: currency }).format(Number(price));
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
                          <Link url={url}>Go to Product</Link>
                      </IndexTable.Cell>
                  </IndexTable.Row>
              ))
            : '';

    const resourceName = {
        singular: 'website',
        plural: 'websites',
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
