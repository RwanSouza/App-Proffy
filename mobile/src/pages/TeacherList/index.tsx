import React, { useState } from 'react';
import { View, ScrollView, TextInput, Text} from 'react-native';
import { BorderlessButton, RectButton } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';
import AsynStorage from '@react-native-community/async-storage';

import styles from './styles';
import PageHeader from '../../components/PageHeader';
import TeacherItem, {Teacher}  from '../../components/TeacherItem';
import api from '../../services/api';
import { useFocusEffect } from '@react-navigation/native';

function TeacherList() {
  const [teachers, setTeachers] = useState([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [ isFilterVisible, setIsFiltersVisible] = useState(false);

  const [subject, setSubject] = useState('');
  const [week_day, setWeekDay] = useState('');
  const [time, setTime] = useState('');

  function loadFavorites() {
    AsynStorage.getItem('favorites').then( res => {
      if(res) {
        const favoritedTeachers = JSON.parse(res);
        const favoritedTeachersId = favoritedTeachers.map((teacher: Teacher)  => {
          return teacher.id;
        });

       setFavorites(favoritedTeachersId);
      }
    });
  }

  useFocusEffect(
    React.useCallback(() => {
      loadFavorites();
    }, [])
  );

  function handleToggleFilterVisible() {
    setIsFiltersVisible(!isFilterVisible);
  }

  async function handleFilterSubmit() {
    loadFavorites();

    const res = await api.get('classes', {
      params: {
        subject,
        week_day,
        time
      }
    });

    setIsFiltersVisible(false)
    setTeachers(res.data)
    }

  return (
    <View style={styles.container} > 
      <PageHeader 
        title="Proffys disponíveis" 
        headerRight={(
          <BorderlessButton onPress={handleToggleFilterVisible}>
            <Feather name="filter" size={20} color="#fff" />
          </BorderlessButton>
        )}
      >
        { isFilterVisible && (
          <View style={styles.searchForm}>
            <Text style={styles.label}>Matéria</Text>
            <TextInput 
              style={styles.input}  
              placeholder="Qual a matéria"
              value={subject}
              onChangeText={text => setSubject(text) }
              placeholderTextColor="#c1bccc"
              />

            <View style={styles.inputGroup}>
              <View style={styles.inputBlock}>
                <Text style={styles.label}>Dia da semana</Text>
                <TextInput 
                  style={styles.input}  
                  placeholder="Qual o dia"
                  value={week_day}
                  onChangeText={text => setWeekDay(text) }
                  placeholderTextColor="#c1bccc" 
                />
              </View>

              <View style={styles.inputBlock}>
                <Text style={styles.label}>Horário</Text>
                <TextInput 
                  style={styles.input}  
                  placeholder="Qual o horário"
                  value={time}
                  onChangeText={text => setTime(text) }
                  placeholderTextColor="#c1bccc" 
                />
              </View>
            </View>

            <RectButton onPress={handleFilterSubmit} style={styles.submitButton}>
              <Text style={styles.submitButtonText}>Filtrar</Text>
            </RectButton>
          </View>
        )}  
      </PageHeader>

      <ScrollView 
        style={styles.teacherList}
        contentContainerStyle={{
          paddingHorizontal:16,
          paddingBottom:16,
        }}
      >
        {teachers.map((teacher: Teacher) => {
          return (
          <TeacherItem 
            key={teacher.id} 
            teacher ={ teacher } 
            favorited={favorites.includes(teacher.id)}
          />)
        })}
      </ScrollView>
    </View>
  )
}

export default TeacherList;