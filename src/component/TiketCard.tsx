import React from 'react';
import {View} from 'react-native';
import Svg, {Path, Text, Line} from 'react-native-svg';
import {toDp} from '../hepers/PercentageToDp';

type Item = {
  name: string;
  qty: number;
  price: number;
};

type ReceiptProps = {
  storeName: string;
  address: string;
  items: Item[];
  total: number;
  date: string;
  width?: number;
  height?: number;
};

const ReceiptSVG: React.FC<ReceiptProps> = ({
  storeName,
  address,
  items,
  total,
  date,
  width = toDp(320),
  height = toDp(200),
}) => {
  const notchRadius = 6;
  const notchCount = Math.floor(width / (notchRadius * 2));

  const createNotchPath = (yPos: number, direction: 'up' | 'down') => {
    let d = `M0,${yPos}`;
    for (let i = 0; i < notchCount; i++) {
      const cx = i * notchRadius * 2 + notchRadius;
      d += ` A${notchRadius},${notchRadius} 0 0 ${direction === 'up' ? 1 : 0} 
        ${cx + notchRadius * 2},${yPos}`;
    }
    return d;
  };

  return (
    <View>
      <Svg width={width} height={height}>
        {/* Background */}
        <Path
          d={`M0,${notchRadius} H${width} V${height - notchRadius} H0 Z`}
          fill="#fff"
          stroke="#ccc"
          strokeWidth={1}
        />

        {/* Sobekan atas */}
        <Path
          d={createNotchPath(0, 'down')}
          stroke="#ccc"
          fill="white"
          strokeWidth={1}
        />
        {/* Sobekan bawah */}
        <Path
          d={createNotchPath(height, 'up')}
          stroke="#ccc"
          fill="white"
          strokeWidth={1}
        />

        {/* Header */}
        <Text
          x={width / 2}
          y={40}
          fontSize="16"
          fontWeight="bold"
          textAnchor="middle">
          {storeName}
        </Text>
        <Text x={width / 2} y={60} fontSize="12" textAnchor="middle">
          {address}
        </Text>

        <Line
          x1="10"
          y1="75"
          x2={width - 10}
          y2="75"
          stroke="#ccc"
          strokeWidth="1"
        />

        {/* Item list */}
        {items.map((item, index) => (
          <Text key={index} x="20" y={100 + index * 20} fontSize="12">
            {item.name} {item.qty} x {item.price.toLocaleString()}
          </Text>
        ))}

        <Line
          x1="10"
          y1={100 + items.length * 20 + 10}
          x2={width - 10}
          y2={100 + items.length * 20 + 10}
          stroke="#aaa"
          strokeDasharray="4 2"
        />

        <Text
          x="20"
          y={100 + items.length * 20 + 30}
          fontSize="14"
          fontWeight="bold">
          Total: Rp{total.toLocaleString()}
        </Text>
        <Text x="20" y={100 + items.length * 20 + 50} fontSize="12">
          Tanggal: {date}
        </Text>
        <Text x="20" y={100 + items.length * 20 + 70} fontSize="12">
          Terima kasih 🙏
        </Text>
      </Svg>
    </View>
  );
};

export default ReceiptSVG;
