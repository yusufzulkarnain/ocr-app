// src/components/RenderModal.tsx
import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Modal from 'react-native-modal';
import {toDp} from '../hepers/PercentageToDp';
import GlobalText from './globalText';
import {IdCard, Bus, Clock} from 'lucide-react-native';

type RenderModalProps = {
  isVisible: boolean;
  onPressbtn: () => void;
  title?: string;
  children?: React.ReactNode;
  titleBtn: string;
  typeIcon?: string;
  visibleBtn?: boolean;
};

const CustomModal: React.FC<RenderModalProps> = ({
  isVisible,
  onPressbtn,
  title,
  children,
  titleBtn,
  typeIcon,
  visibleBtn,
}) => {
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onPressbtn}
      style={styles.bottomModal}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      backdropOpacity={0.5}>
      <View style={styles.modalContent}>
        {title && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: toDp(12),
            }}>
            {typeIcon === 'bus' ? (
              <Bus size={20} color={'#16509B'} />
            ) : typeIcon === 'shift' ? (
              <Clock size={20} color={'#16509B'} />
            ) : (
              <IdCard size={20} color={'#16509B'} />
            )}

            <GlobalText
              typeText="bold"
              size={toDp(18)}
              style={styles.modalTitle}>
              {title}
            </GlobalText>
          </View>
        )}
        {children}
        {visibleBtn && (
          <TouchableOpacity onPress={onPressbtn} style={styles.closeButton}>
            <GlobalText
              typeText="bold"
              size={14}
              style={styles.closeButtonText}>
              {titleBtn}
            </GlobalText>
          </TouchableOpacity>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: toDp(20),
    borderTopLeftRadius: toDp(20),
    borderTopRightRadius: toDp(20),
  },
  modalTitle: {
    // fontSize: toDp(18),
    marginBottom: toDp(8),
    marginLeft: toDp(8),
  },
  closeButton: {
    marginTop: toDp(10),
    backgroundColor: '#16509B',
    padding: toDp(10),
    borderRadius: toDp(8),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
  closeButtonText: {
    color: 'white',
  },
});

export default CustomModal;
