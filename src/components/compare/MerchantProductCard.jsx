import { Avatar, Button, Card, Filters, Pagination, ResourceItem, ResourceList, TextStyle } from '@shopify/polaris';
import { useEffect, useState } from 'react';
import { useAppBridge } from '@shopify/app-bridge-react';
import { userLoggedInFetch } from '../../App.jsx';
import _ from 'lodash';
import priceWithCurrency from '../../utility/currenctUtility.js';

let pageInfo = { endCursor: null, hasNextPage: false, hasPreviousPage: false, startCursor: null };
let filterTimeout;
export function MerchantProductCard(prop) {
    const app = useAppBridge();
    const fetch = userLoggedInFetch(app);

    const [queryValue, setQueryValue] = useState(null);
    const [items, setItems] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const [loadingUrl, setLoadingUrl] = useState(false);

    const handleQueryValueRemove = () => {
        setQueryValue(null);
    };

    const [hasNext, setHasNext] = useState(false);
    const [hasBefore, setHasBefore] = useState(false);

    const getMerchantsProducts = async () => {
        try {
            setLoadingUrl(true);
            const productListResponse = await fetch('/merchant-products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    search: queryValue,
                    end_cursor: pageInfo.endCursor,
                    start_cursor: pageInfo.startCursor,
                }),
            }).then((res) => res.json());

            setItems(productListResponse.body.data.products.edges);
            pageInfo = Object.assign({}, productListResponse.body.data.products.pageInfo);

            setHasNext(pageInfo.hasNextPage);
            setHasBefore(pageInfo.hasPreviousPage);
        } catch (e) {
            setItems([]);
        }
        setLoadingUrl(false);
    };

    useEffect(async () => {
        pageInfo = Object.assign({}, { endCursor: null, hasNextPage: false, hasPreviousPage: false, startCursor: null });

        doFilter(queryValue);
    }, [queryValue]);

    const doFilter = (query) => {
        //setQueryValue(query);
        clearTimeout(filterTimeout);

        filterTimeout = setTimeout(async () => {
            await getMerchantsProducts();
        }, 550);
    };

    const resourceName = {
        singular: 'product',
        plural: 'products',
    };

    const setPage = async (direction) => {
        //left
        if (direction === -1) {
            pageInfo.endCursor = null;
        }

        //right
        if (direction === 1) {
            pageInfo.startCursor = null;
        }

        if (direction === 0) {
            pageInfo.startCursor = null;
            pageInfo.endCursor = null;
        }
        await getMerchantsProducts();
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
                <Pagination nextTooltip={'Next'} previousTooltip={'Previous'} onPrevious={() => setPage(-1)} onNext={() => setPage(+1)} hasPrevious={hasBefore} hasNext={hasNext} />
            </div>
        </Card>
    );

    function renderItem(item) {
        let selectedId = null;
        if (selectedProduct) {
            selectedId = selectedProduct.node.id;
        }
        const { id, title, handle, priceRangeV2, images } = item.node;

        const media = <Avatar customer size="medium" name={id} source={_.get(images, 'edges[0].node') ? images.edges[0].node.url : 'https://polaris.shopify.com/icons/DomainsMajor.svg'} />;

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
                    <div>{priceWithCurrency(priceRangeV2.minVariantPrice.amount, priceRangeV2.minVariantPrice.currencyCode)} </div>
                </ResourceItem>
            </div>
        );
    }
}
