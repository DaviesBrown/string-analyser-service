import { analyzeString } from '../utils/stringAnalyzer.js';
import * as StringModel from '../models/stringModel.js';

export function parseNaturalLanguage(query) {
  const filters = {};
  const lowerQuery = query.toLowerCase();
  
  if (lowerQuery.includes('palindrom')) {
    filters.is_palindrome = true;
  }
  
  if (lowerQuery.includes('single word')) {
    filters.word_count = 1;
  } else if (lowerQuery.includes('two word') || lowerQuery.includes('2 word')) {
    filters.word_count = 2;
  }
  
  const longerMatch = lowerQuery.match(/longer than (\d+)/);
  if (longerMatch) {
    filters.min_length = parseInt(longerMatch[1]) + 1;
  }
  
  const shorterMatch = lowerQuery.match(/shorter than (\d+)/);
  if (shorterMatch) {
    filters.max_length = parseInt(shorterMatch[1]) - 1;
  }
  
  const containsMatch = lowerQuery.match(/contain(?:s|ing)?\s+(?:the\s+)?(?:letter\s+)?([a-z])/);
  if (containsMatch) {
    filters.contains_character = containsMatch[1];
  }
  
  if (lowerQuery.includes('first vowel')) {
    filters.contains_character = 'a';
  }
  
  return filters;
}

export function applyFilters(filters) {
  return StringModel.getAllStrings().filter(item => {
    if (filters.is_palindrome !== undefined && 
        item.properties.is_palindrome !== filters.is_palindrome) {
      return false;
    }
    
    if (filters.min_length !== undefined && 
        item.properties.length < filters.min_length) {
      return false;
    }
    
    if (filters.max_length !== undefined && 
        item.properties.length > filters.max_length) {
      return false;
    }
    
    if (filters.word_count !== undefined && 
        item.properties.word_count !== filters.word_count) {
      return false;
    }
    
    if (filters.contains_character !== undefined && 
        !item.value.includes(filters.contains_character)) {
      return false;
    }
    
    return true;
  });
}

export function createAndAnalyzeString(value) {
  const properties = analyzeString(value);
  return StringModel.createString(properties.sha256_hash, value, properties);
}

export function findString(value) {
  return StringModel.findStringByValue(value);
}

export function deleteString(value) {
  const found = StringModel.findStringEntryByValue(value);
  if (found) {
    return StringModel.deleteString(found[0]);
  }
  return false;
}

export function getHealthStatus() {
  return {
    status: 'ok',
    strings_count: StringModel.getStringCount()
  };
}