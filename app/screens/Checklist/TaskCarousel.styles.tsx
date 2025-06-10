import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    justifyContent: 'flex-start',
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  headerContainer: {
    marginBottom: 10,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: 4,
  },
  termin: {
    fontSize: 14,
    color: '#666',
    textAlign: 'left',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 12,
    fontSize: 14,
    marginBottom: 12,
    backgroundColor: '#f9f9f9',
    textAlignVertical: 'top', // dla Androida
  },
  textArea: {
    height: 120, // odpowiada ~6 liniom
  },
  photoButton: {
    backgroundColor: '#73c0d7',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 10,
  },
  photoButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  photo: {
    width: '100%',
    height: 160,
    borderRadius: 8,
    resizeMode: 'cover',
    backgroundColor: '#ddd',
  },
});
