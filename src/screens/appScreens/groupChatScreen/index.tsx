import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  FlatList,
  DeviceEventEmitter,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  AppState,
} from 'react-native';
import styles from './styles';
import ReceiveComponent from './receiveComponent';
import SendComponent from './sendComponent';
import imagePath from '../../../theme/imagePath';
import {
  socketConnectionCheck,
  socketEmit,
  socketEvent,
} from '../../../utils/socket';
import ImageLoadView from '../../../components/imageLoadView';
import {IMAGE_URL} from '../../../redux/apis/commonValue';
import {chatMediaUploadAction} from '../../../redux/actions/appSessionAction';
import {useDispatch} from 'react-redux';
import {loading} from '../../../redux/reducer/loadingReducer';
import FileViewer from './fileViewer';
import AddMusicFile from '../../../permissions/addMusicFile';

// Interface for each chat message
interface ChatMessage {
  id: number | string;
  user_id: number | string;
  other_user_id: number | string;
  other_user_image?: string;
  other_user_name?: string;
  message: string;
  updated_at: string;
  message_unread_count: number;
  conversation_id?: number | string;
  deleted_for?: number | undefined;
  [key: string]: any;
}

// These are used for pagination.
let messageData: ChatMessage[] = [];
let lastMsgId: number | string = 0;
let firstMsgId: number | string = 0;

interface FileData {
  message: string;
  // Add additional properties if needed
}
const GroupChatScreen = (props: any) => {
  const {other_user_id, userData} = props.route.params || {};
  const dispatch = useDispatch();
  const appState = useRef(AppState.currentState);
  const flatListRef = useRef<FlatList<ChatMessage> | null>(null);
  // Component state
  const [message, setMessage] = useState<string>('');
  const [chatHistoryData, setChatHistoryData] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isBlocked, setIsBlocked] = useState<boolean>(false);
  const [showMediaType, setShowMediaType] = useState<boolean>(false);
  const [showMediaFile, setShowMediaFile] = useState<boolean>(false);
  const [fileData, setFileData] = useState<FileData | null>(null);
  const [fileType, setFileType] = useState<'video' | 'image' | 'audio' | null>(
    null,
  );

  useEffect(() => {
    if (global?.userData) {
      socketConnectionCheck();
    }
  }, []);

  useEffect(() => {
    setIsLoading(true);
    methodGetAllChat();

    const receiveMsgListener = DeviceEventEmitter.addListener(
      'receive_message',
      (res: any) => {
        if (res?.data) {
          methodReceiveMessage(res.data);
        }
      },
    );

    return () => {
      receiveMsgListener.remove();
      // Reset global message data and pagination variables.
      messageData = [];
      setChatHistoryData([]);
      lastMsgId = 0;
      firstMsgId = 0;
    };
  }, []);

  useEffect(() => {
    const appStateManage = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        methodGetAllChat('after');
      }
      appState.current = nextAppState;
    });
    return () => {
      appStateManage.remove();
    };
  }, []);

  const scrollToTop = (): void => {
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({animated: true, offset: 0});
    }
  };

  const methodReceiveMessage = (newMessage: ChatMessage): void => {
    const hasDuplicate = messageData.findIndex(d => d.id === newMessage.id);

    if (
      hasDuplicate === -1 &&
      newMessage?.other_user_id == other_user_id &&
      (newMessage.conversation_id == userData?.conversation_id ||
        !('conversation_id' in userData))
    ) {
      messageData = [newMessage, ...messageData];
      setChatHistoryData(messageData);
    }
    // set first message id ---
    firstMsgId = newMessage.id;
    // read message if available chat screen
    const dic = {
      group_id: other_user_id,
      user_id: global?.userData?.id,
      msg_id: newMessage.id,
    };
    socketEmit(socketEvent.seenGroupMessage, dic, res => {});
  };

  const methodGetAllChat = (listType: 'before' | 'after' = 'before'): void => {
    const dic = {
      user_id: global?.userData?.id,
      other_user_id: other_user_id,
      type: 'GROUP',
      list_type: listType,
      last_id: listType === 'after' ? firstMsgId : lastMsgId,
      limit: 50,
    };
    socketEmit(socketEvent.getchats, dic, (res: any) => {
      setIsLoading(false);
      if (res && res?.blocked_by_me === 1) {
        setIsBlocked(true);
      }
      if (res && res?.data && Array.isArray(res.data)) {
        if (listType === 'after') {
          messageData = [...res.data, ...messageData];
        } else {
          messageData = [...messageData, ...res.data];
        }
        setChatHistoryData(messageData);

        firstMsgId = messageData.length ? messageData[0].id : 0;
        lastMsgId = messageData.length
          ? messageData[messageData.length - 1].id
          : 0;
      }
    });
  };

  const methodSendMessage = ({data}: {data: any}): void => {
    setMessage('');
    const dic = {
      user_id: global?.userData?.id,
      other_user_id: other_user_id,
      message: data?.msg || '',
      type: 'GROUP',
      message_type: data?.msgType,
      thumb: data?.thumb || '',
    };
    socketEmit(socketEvent.send_message, dic, (res: any) => {
      console.log('res--send_message', res);

      if (res && res?.data) {
        messageData = [res.data, ...messageData];
        setChatHistoryData(messageData);
        firstMsgId = res.data.id;
        scrollToTop();
      }
    });
  };

  const methodDeleteChat = (): void => {
    if (firstMsgId == 0) {
      return;
    }
    const dic = {
      user_id: global?.userData?.id,
      other_user_id: other_user_id,
      last_msg_id: firstMsgId,
    };
    socketEmit(socketEvent.clear_group_chat, dic, (data: any) => {
      console.log('data-----', data);

      if (data?.status) {
        messageData = [];
        setChatHistoryData([]);
        lastMsgId = 0;
        firstMsgId = 0;
      }
    });
  };

  // send media Video/Image/Music  ------
  const methodUploadImage = (type: string) => {
    if (type === 'music') {
      AddMusicFile((res: any) => {
        setShowMediaType(false);
        if (res?.uri) {
          methodUploadMediaApi(res?.uri, type);
        }
      });
    } else {
      props.navigation.navigate('ImageController', {
        mediaType: type,
        onSuccess: (res: any) => {
          setShowMediaType(false);
          if (res?.path) {
            methodUploadMediaApi(res?.path, type);
          }
        },
      });
    }
  };

  const methodUploadMediaApi = (path: string, type: string) => {
    const formData = new FormData();
    formData.append(
      'media_type',
      type === 'photo' ? 'IMAGE' : type === 'video' ? 'VIDEO' : 'AUDIO',
    );
    formData.append('chat_media', {
      uri: path,
      type:
        type === 'photo'
          ? 'image/jpeg'
          : type === 'video'
          ? 'video/mp4'
          : 'audio/mpeg',
      name:
        type === 'photo'
          ? 'image_' + Math.floor(Date.now() / 1000) + '.jpeg'
          : type === 'video'
          ? 'video_' + Math.floor(Date.now() / 1000) + '.mp4'
          : 'audio_' + Math.floor(Date.now() / 1000) + '.mp3',
    });
    console.log('formData-----', JSON.stringify(formData));

    setTimeout(() => {
      dispatch(loading(true));
      dispatch(chatMediaUploadAction(formData)).then((response: any) => {
        dispatch(loading(false));
        if (response) {
          let dic = {
            msg: response?.data?.media,
            msgType:
              type === 'photo' ? 'IMAGE' : type === 'video' ? 'VIDEO' : 'AUDIO',
            thumb: response?.data?.media_thumb || '',
          };
          methodSendMessage({data: dic});
        }
      });
    }, 500);
  };

  const onScrollPage = (): void => {
    if (!isLoading && firstMsgId !== 0 && firstMsgId !== lastMsgId) {
      methodGetAllChat('before');
    }
  };

  const methodFileViewer = (
    type: 'video' | 'image' | 'audio',
    data: FileData,
  ) => {
    setFileType(type);
    setFileData(data);
    setShowMediaFile(true);
  };

  const renderChat = ({item}: {item: ChatMessage}): JSX.Element => {
    return (
      <>
        {item.user_id === global?.userData?.id ? (
          <SendComponent
            item={item}
            cb={(type: string) => {
              methodFileViewer(type as 'video' | 'image', item);
            }}
          />
        ) : (
          <ReceiveComponent
            item={item}
            cb={(type: string) => {
              methodFileViewer(type as 'video' | 'image', item);
            }}
          />
        )}
      </>
    );
  };

  const PagingLoader: React.FC = () => {
    return <ActivityIndicator size={'large'} />;
  };
  const methodMediaTypeView = () => {
    return (
      <View style={styles.media_view}>
        <TouchableOpacity
          onPress={() => {
            methodUploadImage('photo');
          }}
          style={styles.media_sub_view}>
          <Image
            source={imagePath.image_icon}
            resizeMode="contain"
            style={styles.media_icon}
          />
          <Text style={styles.media_text}>Image</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            methodUploadImage('video');
          }}
          style={styles.media_sub_view}>
          <Image
            source={imagePath.video_icon}
            resizeMode="contain"
            style={styles.media_icon}
          />
          <Text style={styles.media_text}>Video</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            methodUploadImage('music');
          }}
          style={styles.media_sub_view}>
          <Image
            source={imagePath.music_icon}
            resizeMode="contain"
            style={styles.media_icon}
          />
          <Text style={styles.media_text}>Music</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.view_cancel_icon}
          onPress={() => {
            setShowMediaType(false);
          }}>
          <Image
            source={imagePath.cancel}
            resizeMode="contain"
            style={styles.cancel_icon}
          />
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header_view}>
        <TouchableOpacity
          onPress={() => props.navigation.goBack()}
          activeOpacity={0.6}>
          <Image
            style={styles.chat_back}
            source={imagePath.goBackImgpng}
            resizeMode={'contain'}
          />
        </TouchableOpacity>
        <View style={styles.view_flex}>
          {userData?.other_user_image || userData?.profile_picture ? (
            <ImageLoadView
              style={styles.profile_pic}
              source={
                userData?.other_user_image
                  ? {uri: IMAGE_URL + userData?.other_user_image}
                  : {uri: IMAGE_URL + userData?.profile_picture}
              }
              resizeMode={'cover'}
            />
          ) : (
            <ImageLoadView
              style={styles.profile_pic}
              source={imagePath.user_icon}
              resizeMode={'cover'}
            />
          )}
          <Text numberOfLines={1} style={styles.person_name}>
            {userData?.other_user_name || userData?.name}
          </Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            setShowMediaType(false);
            props.navigation.navigate('MoreOptions', {
              type: 'GROUP',
              cb: (data: string) => {
                if (data === 'delete') {
                  methodDeleteChat();
                }
              },
            });
          }}>
          <Image
            style={styles.more_pic}
            source={imagePath.about_icon}
            resizeMode={'contain'}
          />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{flex: 1}}>
        {/* Chat Section */}
        <FlatList
          ref={flatListRef}
          inverted
          data={chatHistoryData}
          renderItem={renderChat}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps={'handled'}
          onEndReached={onScrollPage}
          onEndReachedThreshold={0.2}
          ListFooterComponent={<View>{isLoading && <PagingLoader />}</View>}
          contentContainerStyle={{flexGrow: 1}}
        />

        {/* Footer: Message Input Section */}
        {showMediaType ? methodMediaTypeView() : <></>}
        <View
          style={{
            ...styles.footer_view,
            display: isBlocked ? 'none' : 'flex',
          }}>
          <TouchableOpacity
            onPress={() => {
              setShowMediaType(!showMediaType);
            }}>
            <Image
              source={imagePath.add_icon}
              resizeMode="contain"
              style={styles.attachment_icon}
            />
          </TouchableOpacity>
          <View style={styles.textInput_view}>
            <TextInput
              style={styles.textInput_style}
              placeholder={'Type a message'}
              multiline
              keyboardType={'default'}
              underlineColorAndroid="transparent"
              value={message}
              placeholderTextColor="#BABFC7"
              onChangeText={(value: string) => setMessage(value)}
            />
          </View>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => {
              if (message.trim()) {
                let dic = {
                  msg: message.trim(),
                  msgType: 'TEXT',
                };
                methodSendMessage({data: dic});
              }
            }}
            style={{
              display: message.trim() ? 'flex' : 'none',
            }}>
            <Image
              source={imagePath.send}
              resizeMode="contain"
              style={styles.send_icon}
            />
          </TouchableOpacity>
        </View>

        {/* Blocked User Notice */}
        <View
          style={{
            ...styles.block_user_view,
            display: isBlocked ? 'flex' : 'none',
          }}>
          <Text style={styles.block_user_text}>You have blocked this user</Text>
        </View>
        {/* view media file component */}
        {showMediaFile && fileData && fileType && (
          <FileViewer
            visible={showMediaFile}
            fileData={fileData}
            fileType={fileType}
            onClose={() => {
              setShowMediaFile(false);
            }}
          />
        )}
      </KeyboardAvoidingView>
    </View>
  );
};

export default GroupChatScreen;
