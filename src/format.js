const yen = new Intl.NumberFormat('en-US', { maximumFractionDigits: 3 });

export const formatYen = (value) => yen.format(value);

// 符号は 1 つだけ付けます。0 は利益側 (+) です。
export const formatSignedYen = (value) => `${value >= 0 ? '+' : '-'}${yen.format(Math.abs(value))}`;

// 日本式の配色です。値上がり (同値を含む) は赤、値下がりは緑にします。
export const priceTrendClass = (buy, current) => (current >= buy ? 'text-danger' : 'text-success');
