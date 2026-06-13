import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, TouchableOpacity, Image} from 'react-native';
import styles from './styles';
import {useDispatch} from 'react-redux';
import imagePath from '../../../theme/imagePath';
import {IMAGE_URL} from '../../../redux/apis/commonValue';
import {AppButton, AppInput, ImageLoadView} from '../../../components';
import {
  createGroupAction,
  userListForChatAction,
} from '../../../redux/actions/appSessionAction';
import {maxLengthName} from '../../../utils/validation';
import {hasNotch} from 'react-native-device-info';
import {loading} from '../../../redux/reducer/loadingReducer';
import {showToastMessage} from '../../../utils/toast';
interface User {
  id: number;
  name: string;
  profile_picture: string;
}
const CreateGroup = (props: any) => {
  const dispatch = useDispatch();
  const [userList, setUserList] = useState<any>([]);
  const [selectUsers, setSelectUsers] = useState<User[]>([]);
  const [groupForm, setGroupForm] = useState({
    group_name: '',
    image: '',
  });

  useEffect(() => {
    // Fetch user list for chat.
    dispatch(userListForChatAction()).then((res: any) => {
      if (res && res.data) {
        setUserList(res.data);
      }
    });
  }, [dispatch]);

  const methodCreateGroup = () => {
    if (!groupForm.group_name) {
      showToastMessage('Please enter group name.');
      return;
    }
    if (!selectUsers?.length) {
      showToastMessage('Please select user.');
      return;
    }
    if (!groupForm?.image) {
      showToastMessage('Please select group image.');
      return;
    }
    let userIdArr = selectUsers?.map(d => {
      return d.id;
    });
    console.log('selectUsers-----------', userIdArr);

    const formData = new FormData();
    formData.append('group_name', groupForm.group_name);
    formData.append('user_ids', JSON.stringify(userIdArr));

    if (groupForm?.image && !groupForm?.image?.includes('http')) {
      formData.append('image', {
        uri: groupForm?.image,
        type: 'image/jpeg',
        name: 'image_' + Math.floor(Date.now() / 1000) + '.jpeg',
      });
    }
    dispatch(loading(true));
    dispatch(createGroupAction(formData)).then((res: any) => {
      dispatch(loading(false));
      if (res) {
        props.navigation.navigate('BottomTab', {screen: 'Chat'});
      }
    });
  };

  const methodUploadImage = () => {
    props.navigation.navigate('ImageController', {
      mediaType: 'photo',
      onSuccess: (res: any) => {
        if (res?.path) {
          setGroupForm({...groupForm, image: res?.path});
        }
      },
    });
  };

  const toggleUserSelection = (user: any) => {
    if (selectUsers.some(selected => selected.id === user.id)) {
      setSelectUsers(prev => prev.filter(item => item.id !== user.id));
    } else {
      setSelectUsers(prev => [...prev, user]);
    }
  };

  const renderUserItem = ({item}: {item: User}) => {
    if (item.id === global?.userData?.id) {
      return null;
    }
    const isSelected = selectUsers.some(selected => selected.id === item.id);
    return (
      <TouchableOpacity
        style={styles.userItem}
        onPress={() => toggleUserSelection(item)}>
        <ImageLoadView
          source={
            item.profile_picture
              ? {uri: IMAGE_URL + item.profile_picture}
              : imagePath.user_icon
          }
          style={styles.userImage}
          resizeMode="cover"
        />
        <View style={{flex: 1}}>
          <Text style={styles.userName}>{item.name}</Text>
        </View>
        <Image
          source={isSelected ? imagePath.check : imagePath.uncheck}
          style={styles.img_check}
          resizeMode="contain"
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, {paddingTop: hasNotch() ? 55 : 45}]}>
      <View style={styles.view_group_icon}>
        <ImageLoadView
          source={
            groupForm?.image ? {uri: groupForm?.image} : imagePath.user_icon
          }
          resizeMode="cover"
          style={styles.img_group}
        />
        <Text
          onPress={() => {
            methodUploadImage();
          }}
          style={styles.text_edit_icon}>
          {groupForm?.image ? 'Edit Photo' : 'Add Photo'}
        </Text>
      </View>
      <AppInput
        value={groupForm?.group_name}
        placeholder={'Group name'}
        onChangeText={value => {
          if (value?.length === 1) {
            value = value.replace(/\s/g, '');
          }
          setGroupForm({...groupForm, group_name: value});
        }}
        returnKeyType={'done'}
        maxLength={maxLengthName}
      />
      <Text style={styles.header}>{`Select User`}</Text>
      <FlatList
        data={userList}
        keyExtractor={item => item.id.toString()}
        renderItem={renderUserItem}
        ListEmptyComponent={
          <Text style={styles.emptyText}>{'No user found'}</Text>
        }
        contentContainerStyle={userList.length === 0 && styles.emptyContainer}
      />
      <AppButton
        title={'Submit'}
        onPress={() => {
          methodCreateGroup();
        }}
      />
    </View>
  );
};

export default CreateGroup;
