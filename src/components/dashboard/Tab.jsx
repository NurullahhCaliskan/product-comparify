import { useCallback, useState } from 'react';
import { Card, Tabs } from '@shopify/polaris';
import { MailHistoryTab } from './MailHistoryTab.';
import { ProductMailHistoryTab } from './ProductMailHistoryTab..jsx';

export function Tab() {
    const [selected, setSelected] = useState(0);

    const handleTabChange = useCallback((selectedTabIndex) => {
        setSelected(selectedTabIndex);
        console.log(selected);
    }, []);

    const tabs = [
        {
            id: '0',
            content: 'Mail History',
            accessibilityLabel: 'All customers',
            panelID: 'all-customers-content-1',
        },
        {
            id: '1',
            content: 'Product Detail',
            panelID: 'accepts-marketing-content-1',
        },
    ];

    return (
        <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange} fitted>
            <Card.Section>
                <div style={{ display: selected === 0 ? 'block' : 'none' }}>
                    <MailHistoryTab />
                </div>
                <div style={{ display: selected === 1 ? 'block' : 'none' }}>
                    <ProductMailHistoryTab />
                </div>
            </Card.Section>
        </Tabs>
    );
}
