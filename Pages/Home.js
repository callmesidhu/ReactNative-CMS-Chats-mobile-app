import React, { useState, useEffect } from 'react';
import { View, Text, Alert } from 'react-native';
import { Image } from 'expo-image';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useAuth } from '../Context/authContext';
import ChatPreview from '../Components/ChatPreview';
import { blurhash } from '../Context/assests';
import { getDocs, query, where } from 'firebase/firestore';
import { usersRef } from '../firebase/config';


export default function Home() {
  const { user,logout } = useAuth();
 
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const viewProfile = () =>{
      Alert.alert("profile")
  }


  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  const [profile , setProfile] = useState(['']);
  const getUser = async () => {
    const q = query(usersRef, where('userId', '==', user?.uid));
    const querySnapshot = await getDocs(q);
    let data = [];
    querySnapshot.forEach(doc => {
      sleep(1000); 
      data.push({ ...doc.data() });
    });
    setProfile(data[0]); 
  };
      useEffect(()=>{
        if(user?.uid){
          getUser();
        }
          
      },[user?.uid]);

  return (
    <View className='flex-1'>
      <View className='justify-between flex-row bg-sky-600 w-[100%] rounded-b-3xl h-24 px-5 items-center pt-6'>
        <Text className='text-2xl text-white font-medium'>Chats</Text>
        <View>
          <Menu>
            <MenuTrigger>
              <Image
                className='float-left'
                style={{ height: hp(6), aspectRatio: 1, borderRadius: 100 }}
                source={{uri:profile?.imageUrl}}
                placeholder={{ blurhash }}
                contentFit="cover"
                transition={1000}
              />
            </MenuTrigger>
            <MenuOptions>
              <MenuOption onSelect={viewProfile}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Icon name="user" size={20} color="black" />
                  <Text style={{ marginLeft: 10 }}>Profile</Text>
                </View>
              </MenuOption>
              <MenuOption onSelect={handleLogout}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Icon name="sign-out" size={20} color="red" />
                  <Text style={{ marginLeft: 10, color: 'red' }}>Log Out</Text>
                </View>
              </MenuOption>
            </MenuOptions>
          </Menu>
        </View>
      </View>

    <ChatPreview/>
    </View>
  );
}
