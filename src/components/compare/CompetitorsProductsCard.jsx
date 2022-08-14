import { Avatar, Button, Card, Filters, Pagination, ResourceItem, ResourceList, TextStyle } from '@shopify/polaris';
import { useCallback, useEffect, useState } from 'react';
import { useAppBridge } from '@shopify/app-bridge-react';
import { userLoggedInFetch } from '../../App.jsx';
import _ from 'lodash';

let clickedToRemoveFilter = false;
let filterTimeout;
export function CompetitorsProductsCard(prop) {
    const app = useAppBridge();
    const fetch = userLoggedInFetch(app);

    const [queryValue, setQueryValue] = useState(null);
    const [items, setItems] = useState([]);
    const [itemsCount, setItemsCount] = useState(0);
    const [selectedProduct, setSelectedProduct] = useState(null);

    let itemsCountWithoutState = 0;
    let pageIndexWithoutState = 0;

    const [loadingUrl, setLoadingUrl] = useState(false);

    const handleQueryValueRemove = () => {
        clickedToRemoveFilter = true;
        setQueryValue(null);
    };

    const [pageIndex, setPageIndex] = useState(0);
    const [pageMaxIndex, setPageMaxIndex] = useState(0);

    const getSameProducts = async () => {
        let item = prop.merchantProduct;
        if (!prop.merchantProduct) {
            return;
        }
        setLoadingUrl(true);
        try {
            console.log(item);
            const productListResponse = await fetch('/compare-product', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: item.node.id,
                    handle: item.node.handle,
                    vendor: item.node.vendor,
                    tags: item.node.tags,
                    productType: item.node.productType,
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
        doFilter(queryValue);
    }, [queryValue]);

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

    const doFilter = (query) => {
        clearTimeout(filterTimeout);

        filterTimeout = setTimeout(async () => {
            await setPage(0);
        }, 400);
    };

    const filterControl = (
        <Filters queryValue={queryValue} filters={[]} onQueryChange={setQueryValue} onQueryClear={handleQueryValueRemove}>
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
        let selectedId = null;
        if (selectedProduct) {
            selectedId = selectedProduct.id;
        }
        const { id, title, images, website } = item;

        const media = <Avatar customer size="medium" name={id} source={_.get(images, '[0]') ? images[0].src : 'https://polaris.shopify.com/icons/DomainsMajor.svg'} />;

        return (
            <div style={selectedId === id ? { borderStyle: 'solid' } : {}}>
                <ResourceItem
                    id={id}
                    media={media}
                    onClick={() => {
                        prop.selectProduct(item);
                        setSelectedProduct(item);
                    }}
                >
                    <h3>
                        <TextStyle variation="strong">{title}</TextStyle>
                    </h3>
                    <div>{website} </div>
                </ResourceItem>
            </div>
        );
    }
}
