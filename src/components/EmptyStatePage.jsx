import { Page, Layout, EmptyState } from "@shopify/polaris";
import { useState } from "react";
import axios from "axios";

const img = "https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg";

export function EmptyStatePage() {
    const [open, setOpen] = useState(false);

    const sendRequestTest = () => {
        axios.get(`https://jsonplaceholder.typicode.com/users`)
            .then(res => {
                const persons = res.data;
            })
    }

    const handleSelection = (resources) => {
        setOpen(false);
        console.log('action')
    };

    return (
        <Page>
            <Layout>
                <Layout.Section>
                    <button onClick={() => sendRequestTest()}>asd2</button>
                    <button className="Polaris-Button">Example button</button>
                    <EmptyState
                        heading="Discount your products temporarily3"
                        action={{
                            content: "Select products",
                            onAction: () => setOpen(true),
                        }}
                        image={img}
                        imageContained
                    >
                        <p>Select products to change their price temporarily.</p>
                    </EmptyState>
                </Layout.Section>
            </Layout>
        </Page>
    );
}
