import * as StringService from '../services/stringService.js';

export function createString(req, res) {
  const { value } = req.body;
  
  if (!req.body.hasOwnProperty('value')) {
    return res.status(400).json({ error: 'Missing "value" field in request body' });
  }
  
  if (typeof value !== 'string') {
    return res.status(422).json({ error: 'Invalid data type for "value" (must be string)' });
  }
  
  const existingString = StringService.findString(value);
  if (existingString) {
    return res.status(409).json({ error: 'String already exists in the system' });
  }
  
  const stringRecord = StringService.createAndAnalyzeString(value);
  res.status(201).json(stringRecord);
}

export function getString(req, res) {
  const stringValue = decodeURIComponent(req.params.string_value);
  const found = StringService.findString(stringValue);
  
  if (!found) {
    return res.status(404).json({ error: 'String does not exist in the system' });
  }
  
  res.json(found);
}

export function getAllStrings(req, res) {
  try {
    const filters = {};
    
    if (req.query.is_palindrome !== undefined) {
      const val = req.query.is_palindrome.toLowerCase();
      if (val !== 'true' && val !== 'false') {
        return res.status(400).json({ error: 'Invalid value for is_palindrome (must be true or false)' });
      }
      filters.is_palindrome = val === 'true';
    }
    
    if (req.query.min_length !== undefined) {
      filters.min_length = parseInt(req.query.min_length);
      if (isNaN(filters.min_length)) {
        return res.status(400).json({ error: 'Invalid value for min_length (must be integer)' });
      }
    }
    
    if (req.query.max_length !== undefined) {
      filters.max_length = parseInt(req.query.max_length);
      if (isNaN(filters.max_length)) {
        return res.status(400).json({ error: 'Invalid value for max_length (must be integer)' });
      }
    }
    
    if (req.query.word_count !== undefined) {
      filters.word_count = parseInt(req.query.word_count);
      if (isNaN(filters.word_count)) {
        return res.status(400).json({ error: 'Invalid value for word_count (must be integer)' });
      }
    }
    
    if (req.query.contains_character !== undefined) {
      filters.contains_character = req.query.contains_character;
      if (filters.contains_character.length !== 1) {
        return res.status(400).json({ error: 'Invalid value for contains_character (must be single character)' });
      }
    }
    
    const data = StringService.applyFilters(filters);
    
    res.json({
      data,
      count: data.length,
      filters_applied: filters
    });
  } catch (error) {
    res.status(400).json({ error: 'Invalid query parameter values or types' });
  }
}

export function filterByNaturalLanguage(req, res) {
  const { query } = req.query;
  
  if (!query) {
    return res.status(400).json({ error: 'Missing "query" parameter' });
  }
  
  try {
    const parsed_filters = StringService.parseNaturalLanguage(query);
    
    if (Object.keys(parsed_filters).length === 0) {
      return res.status(400).json({ error: 'Unable to parse natural language query' });
    }
    
    const data = StringService.applyFilters(parsed_filters);
    
    res.json({
      data,
      count: data.length,
      interpreted_query: {
        original: query,
        parsed_filters
      }
    });
  } catch (error) {
    res.status(400).json({ error: 'Unable to parse natural language query' });
  }
}

export function deleteString(req, res) {
  const stringValue = decodeURIComponent(req.params.string_value);
  
  if (!StringService.findString(stringValue)) {
    return res.status(404).json({ error: 'String does not exist in the system' });
  }
  
  StringService.deleteString(stringValue);
  res.status(204).send();
}

export function getHealth(req, res) {
  res.json(StringService.getHealthStatus());
}