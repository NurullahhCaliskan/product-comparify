import { Avatar, Button, Card, Filters, Pagination, ResourceItem, ResourceList, TextStyle } from '@shopify/polaris';
import { useCallback, useEffect, useState } from 'react';
import { useAppBridge } from '@shopify/app-bridge-react';
import { userLoggedInFetch } from '../../App.jsx';
import _ from 'lodash';

export function CompetitorsProductsCard(prop) {
    const app = useAppBridge();
    const fetch = userLoggedInFetch(app);

    const [queryValue, setQueryValue] = useState(null);
    const [items, setItems] = useState([]);
    const [itemsCount, setItemsCount] = useState(0);

    let itemsCountWithoutState = 0;
    let pageIndexWithoutState = 0;

    const [loadingUrl, setLoadingUrl] = useState(false);

    const handleQueryValueRemove = useCallback(() => setQueryValue(null), []);
    const handleClearAll = useCallback(() => {
        handleQueryValueRemove();
    }, [handleQueryValueRemove]);

    const [pageIndex, setPageIndex] = useState(0);
    const [pageMaxIndex, setPageMaxIndex] = useState(0);

    const getSameProducts = async () => {
        let item = prop.merchantProduct;
        if (!prop.merchantProduct) {
            return;
        }
        setLoadingUrl(true);
        try {
            const productListResponse = await fetch('/compare-product', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: item.node.id,
                    search: queryValue,
                    offset: pageIndexWithoutState * 10,
                }),
            }).then((res) => res.json());
            setItems(productListResponse.data);

            setItemsCount(productListResponse.count);
            itemsCountWithoutState = productListResponse.count;
        } catch (e) {
            console.log(e);
        }
        setLoadingUrl(false);
    };

    useEffect(async () => {
        await setPage(0);
    }, [prop.merchantProduct]);

    const setPage = async (index) => {
        pageIndexWithoutState = index;

        await getSameProducts();

        let productMaxIndex = Math.max(Math.ceil(itemsCountWithoutState / 10) - 1, 0);

        index = Math.min(index, productMaxIndex);

        setPageIndex(index);
        setPageMaxIndex(productMaxIndex);
    };

    const resourceName = {
        singular: "competitor's product",
        plural: "competitor's products",
    };

    const filters = [];

    const filterControl = (
        <Filters queryValue={queryValue} filters={filters} onQueryChange={setQueryValue} onQueryClear={handleQueryValueRemove} onClearAll={handleClearAll}>
            <div style={{ paddingLeft: '8px' }}>
                <Button onClick={() => setPage(0)}>Search</Button>
            </div>
        </Filters>
    );

    return (
        <Card>
            <ResourceList loading={loadingUrl} resourceName={resourceName} items={items} renderItem={renderItem} filterControl={filterControl} />

            <div style={{ marginLeft: '45%' }}>
                <Pagination
                    label={
                        <p>
                            {pageIndex + 1} / {pageMaxIndex + 1}
                        </p>
                    }
                    nextTooltip={'Next'}
                    previousTooltip={'Previous'}
                    onPrevious={() => setPage(pageIndex - 1)}
                    onNext={() => setPage(pageIndex + 1)}
                    hasPrevious={pageIndex !== 0 && !loadingUrl}
                    hasNext={pageIndex < pageMaxIndex && !loadingUrl}
                />
            </div>
        </Card>
    );

    function renderItem(item) {
        const { id, title, images, website } = item;

        const media = <Avatar customer size="medium" name={id} source={_.get(images, '[0]') ? images[0].src : 'https://polaris.shopify.com/icons/DomainsMajor.svg'} />;

        return (
            <ResourceItem id={id} media={media} onClick={() => prop.selectProduct(item)}>
                <h3>
                    <TextStyle variation="strong">{title}</TextStyle>
                </h3>
                <div>{website} </div>
            </ResourceItem>
        );
    }
}
