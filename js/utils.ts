/**
 * @fileoverview Core utility functions for the Spanish Learning App
 * Provides general-purpose helpers, DOM utilities, string manipulation,
 * array operations, and other commonly used functions throughout the app.
 */

import type {
  Exercise,
  ExerciseType,
  UserProgress,
  ExerciseMetadata
} from '../types/core.js';

// ============================================================================
// Type Definitions
// ============================================================================

interface AnimationOptions {
  duration?: number;
  easing?: string;
  fill?: FillMode;
}

interface FeedbackOptions {
  duration?: number;
  type?: 'success' | 'error' | 'info' | 'warning';
  autoDismiss?: boolean;
}

interface StorageOptions {
  encrypt?: boolean;
  compress?: boolean;
  ttl?: number; // Time to live in milliseconds
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
}

interface DebounceOptions {
  leading?: boolean;
  trailing?: boolean;
  maxWait?: number;
}

// ============================================================================
// Constants
// ============================================================================

const STORAGE_PREFIX = 'spanish_app_';
const ANIMATION_DURATION_MS = 300;
const DEBOUNCE_DELAY_MS = 300;
const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAY_MS = 1000;

// ============================================================================
// DOM Utilities
// ============================================================================

/**
 * Safely query a single element with type safety
 */
export function querySelector<T extends Element = Element>(
  selector: string,
  parent: ParentNode = document
): T | null {
  try {
    return parent.querySelector<T>(selector);
  } catch (error) {
    console.error(`Error querying selector "${selector}":`, error);
    return null;
  }
}

/**
 * Safely query multiple elements with type safety
 */
export function querySelectorAll<T extends Element = Element>(
  selector: string,
  parent: ParentNode = document
): T[] {
  try {
    return Array.from(parent.querySelectorAll<T>(selector));
  } catch (error) {
    console.error(`Error querying selector "${selector}":`, error);
    return [];
  }
}

/**
 * Create an element with attributes and content
 */
export function createElement<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attributes: Record<string, string> = {},
  content: string | Node | Node[] = ''
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tag);

  // Set attributes
  Object.entries(attributes).forEach(([key, value]) => {
    if (key === 'className') {
      element.className = value;
    } else if (key === 'innerHTML') {
      element.innerHTML = value;
    } else if (key === 'textContent') {
      element.textContent = value;
    } else {
      element.setAttribute(key, value);
    }
  });

  // Set content
  if (typeof content === 'string') {
    element.textContent = content;
  } else if (content instanceof Node) {
    element.appendChild(content);
  } else if (Array.isArray(content)) {
    content.forEach(node => element.appendChild(node));
  }

  return element;
}

/**
 * Safely remove an element from the DOM
 */
export function removeElement(element: Element | null): void {
  if (element && element.parentNode) {
    element.parentNode.removeChild(element);
  }
}

/**
 * Add event listener with automatic cleanup
 */
export function addEventListenerWithCleanup<K extends keyof HTMLElementEventMap>(
  element: HTMLElement,
  event: K,
  handler: (event: HTMLElementEventMap[K]) => void,
  options?: AddEventListenerOptions
): () => void {
  element.addEventListener(event, handler, options);
  return () => element.removeEventListener(event, handler, options);
}

/**
 * Toggle class on element
 */
export function toggleClass(
  element: Element,
  className: string,
  force?: boolean
): boolean {
  return element.classList.toggle(className, force);
}

/**
 * Add multiple classes to element
 */
export function addClasses(element: Element, ...classes: string[]): void {
  element.classList.add(...classes.filter(Boolean));
}

/**
 * Remove multiple classes from element
 */
export function removeClasses(element: Element, ...classes: string[]): void {
  element.classList.remove(...classes.filter(Boolean));
}

/**
 * Check if element has class
 */
export function hasClass(element: Element, className: string): boolean {
  return element.classList.contains(className);
}

/**
 * Show element (remove hidden class)
 */
export function showElement(element: HTMLElement): void {
  element.classList.remove('hidden');
  element.style.display = '';
}

/**
 * Hide element (add hidden class)
 */
export function hideElement(element: HTMLElement): void {
  element.classList.add('hidden');
  element.style.display = 'none';
}

/**
 * Check if element is visible
 */
export function isVisible(element: HTMLElement): boolean {
  return !element.classList.contains('hidden') &&
         element.style.display !== 'none' &&
         element.offsetParent !== null;
}

/**
 * Scroll element into view smoothly
 */
export function scrollIntoView(
  element: Element,
  options: ScrollIntoViewOptions = { behavior: 'smooth', block: 'center' }
): void {
  element.scrollIntoView(options);
}

/**
 * Get element offset from document
 */
export function getElementOffset(element: Element): { top: number; left: number } {
  const rect = element.getBoundingClientRect();
  return {
    top: rect.top + window.scrollY,
    left: rect.left + window.scrollX
  };
}

/**
 * Check if element is in viewport
 */
export function isInViewport(element: Element, threshold = 0): boolean {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= -threshold &&
    rect.left >= -threshold &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + threshold &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth) + threshold
  );
}

/**
 * Animate element with Web Animations API
 */
export function animate(
  element: Element,
  keyframes: Keyframe[],
  options: AnimationOptions = {}
): Animation {
  const defaultOptions: KeyframeAnimationOptions = {
    duration: ANIMATION_DURATION_MS,
    easing: 'ease-in-out',
    fill: 'forwards',
    ...options
  };
  return element.animate(keyframes, defaultOptions);
}

/**
 * Fade in element
 */
export async function fadeIn(
  element: HTMLElement,
  duration = ANIMATION_DURATION_MS
): Promise<void> {
  element.style.opacity = '0';
  showElement(element);

  const animation = animate(element, [
    { opacity: 0 },
    { opacity: 1 }
  ], { duration });

  await animation.finished;
  element.style.opacity = '';
}

/**
 * Fade out element
 */
export async function fadeOut(
  element: HTMLElement,
  duration = ANIMATION_DURATION_MS
): Promise<void> {
  const animation = animate(element, [
    { opacity: 1 },
    { opacity: 0 }
  ], { duration });

  await animation.finished;
  hideElement(element);
  element.style.opacity = '';
}

/**
 * Slide down element
 */
export async function slideDown(
  element: HTMLElement,
  duration = ANIMATION_DURATION_MS
): Promise<void> {
  element.style.height = '0';
  element.style.overflow = 'hidden';
  showElement(element);

  const height = element.scrollHeight;

  const animation = animate(element, [
    { height: '0px' },
    { height: `${height}px` }
  ], { duration });

  await animation.finished;
  element.style.height = '';
  element.style.overflow = '';
}

/**
 * Slide up element
 */
export async function slideUp(
  element: HTMLElement,
  duration = ANIMATION_DURATION_MS
): Promise<void> {
  const height = element.scrollHeight;
  element.style.height = `${height}px`;
  element.style.overflow = 'hidden';

  const animation = animate(element, [
    { height: `${height}px` },
    { height: '0px' }
  ], { duration });

  await animation.finished;
  hideElement(element);
  element.style.height = '';
  element.style.overflow = '';
}

// ============================================================================
// String Utilities
// ============================================================================

/**
 * Capitalize first letter of string
 */
export function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Convert string to title case
 */
export function toTitleCase(str: string): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .map(word => capitalize(word))
    .join(' ');
}

/**
 * Truncate string to specified length
 */
export function truncate(str: string, maxLength: number, suffix = '...'): string {
  if (!str || str.length <= maxLength) return str;
  return str.slice(0, maxLength - suffix.length) + suffix;
}

/**
 * Remove HTML tags from string
 */
export function stripHtml(html: string): string {
  const temp = document.createElement('div');
  temp.innerHTML = html;
  return temp.textContent || temp.innerText || '';
}

/**
 * Escape HTML special characters
 */
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, char => map[char] || char);
}

/**
 * Unescape HTML special characters
 */
export function unescapeHtml(html: string): string {
  const temp = document.createElement('textarea');
  temp.innerHTML = html;
  return temp.value;
}

/**
 * Convert kebab-case to camelCase
 */
export function kebabToCamel(str: string): string {
  return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Convert camelCase to kebab-case
 */
export function camelToKebab(str: string): string {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * Remove accents from string
 */
export function removeAccents(str: string): string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/**
 * Compare strings ignoring case and accents
 */
export function compareStringsLoose(str1: string, str2: string): boolean {
  const normalize = (s: string) => removeAccents(s.toLowerCase().trim());
  return normalize(str1) === normalize(str2);
}

/**
 * Check if string contains substring (case-insensitive)
 */
export function containsIgnoreCase(haystack: string, needle: string): boolean {
  return haystack.toLowerCase().includes(needle.toLowerCase());
}

/**
 * Count words in string
 */
export function countWords(str: string): number {
  return str.trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Generate random string
 */
export function randomString(length: number, charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'): string {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return result;
}

/**
 * Generate UUID v4
 */
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Slugify string (URL-friendly)
 */
export function slugify(str: string): string {
  return removeAccents(str)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// ============================================================================
// Array Utilities
// ============================================================================

/**
 * Shuffle array (Fisher-Yates algorithm)
 */
export function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Get random element from array
 */
export function randomElement<T>(array: T[]): T | undefined {
  if (array.length === 0) return undefined;
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Get random elements from array (without replacement)
 */
export function randomElements<T>(array: T[], count: number): T[] {
  if (count >= array.length) return shuffle(array);
  return shuffle(array).slice(0, count);
}

/**
 * Remove duplicates from array
 */
export function unique<T>(array: T[]): T[] {
  return [...new Set(array)];
}

/**
 * Remove duplicates by key function
 */
export function uniqueBy<T>(array: T[], keyFn: (item: T) => unknown): T[] {
  const seen = new Set();
  return array.filter(item => {
    const key = keyFn(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * Group array elements by key function
 */
export function groupBy<T>(array: T[], keyFn: (item: T) => string): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const key = keyFn(item);
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
    return groups;
  }, {} as Record<string, T[]>);
}

/**
 * Chunk array into smaller arrays
 */
export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

/**
 * Flatten nested arrays
 */
export function flatten<T>(array: (T | T[])[]): T[] {
  return array.reduce<T[]>((flat, item) => {
    return flat.concat(Array.isArray(item) ? flatten(item) : item);
  }, []);
}

/**
 * Partition array by predicate
 */
export function partition<T>(
  array: T[],
  predicate: (item: T) => boolean
): [T[], T[]] {
  const pass: T[] = [];
  const fail: T[] = [];
  array.forEach(item => {
    if (predicate(item)) {
      pass.push(item);
    } else {
      fail.push(item);
    }
  });
  return [pass, fail];
}

/**
 * Find last element matching predicate
 */
export function findLast<T>(
  array: T[],
  predicate: (item: T) => boolean
): T | undefined {
  for (let i = array.length - 1; i >= 0; i--) {
    if (predicate(array[i])) {
      return array[i];
    }
  }
  return undefined;
}

/**
 * Sum array of numbers
 */
export function sum(numbers: number[]): number {
  return numbers.reduce((total, num) => total + num, 0);
}

/**
 * Calculate average of numbers
 */
export function average(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  return sum(numbers) / numbers.length;
}

/**
 * Calculate median of numbers
 */
export function median(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  const sorted = [...numbers].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

/**
 * Get minimum value from array
 */
export function min(numbers: number[]): number {
  return Math.min(...numbers);
}

/**
 * Get maximum value from array
 */
export function max(numbers: number[]): number {
  return Math.max(...numbers);
}

/**
 * Sort array by key function
 */
export function sortBy<T>(
  array: T[],
  keyFn: (item: T) => number | string,
  order: 'asc' | 'desc' = 'asc'
): T[] {
  const result = [...array];
  result.sort((a, b) => {
    const aKey = keyFn(a);
    const bKey = keyFn(b);
    const comparison = aKey < bKey ? -1 : aKey > bKey ? 1 : 0;
    return order === 'asc' ? comparison : -comparison;
  });
  return result;
}

// ============================================================================
// Object Utilities
// ============================================================================

/**
 * Deep clone object
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T;
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as unknown as T;
  if (obj instanceof Object) {
    const cloned = {} as T;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = deepClone(obj[key]);
      }
    }
    return cloned;
  }
  return obj;
}

/**
 * Deep merge objects
 */
export function deepMerge<T extends Record<string, unknown>>(
  target: T,
  ...sources: Partial<T>[]
): T {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        deepMerge(target[key] as Record<string, unknown>, source[key] as Record<string, unknown>);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return deepMerge(target, ...sources);
}

/**
 * Check if value is plain object
 */
export function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/**
 * Get nested property value
 */
export function getNestedProperty<T = unknown>(
  obj: unknown,
  path: string,
  defaultValue?: T
): T | undefined {
  const keys = path.split('.');
  let result: unknown = obj;

  for (const key of keys) {
    if (result === null || result === undefined || typeof result !== 'object') {
      return defaultValue;
    }
    result = (result as Record<string, unknown>)[key];
  }

  return result as T ?? defaultValue;
}

/**
 * Set nested property value
 */
export function setNestedProperty(
  obj: Record<string, unknown>,
  path: string,
  value: unknown
): void {
  const keys = path.split('.');
  const lastKey = keys.pop()!;
  let current: Record<string, unknown> = obj;

  for (const key of keys) {
    if (!current[key] || typeof current[key] !== 'object') {
      current[key] = {};
    }
    current = current[key] as Record<string, unknown>;
  }

  current[lastKey] = value;
}

/**
 * Pick properties from object
 */
export function pick<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  const result = {} as Pick<T, K>;
  keys.forEach(key => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  return result;
}

/**
 * Omit properties from object
 */
export function omit<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  const result = { ...obj };
  keys.forEach(key => {
    delete result[key];
  });
  return result;
}

/**
 * Check if object is empty
 */
export function isEmpty(obj: unknown): boolean {
  if (obj === null || obj === undefined) return true;
  if (typeof obj === 'string' || Array.isArray(obj)) return obj.length === 0;
  if (typeof obj === 'object') return Object.keys(obj).length === 0;
  return false;
}

// ============================================================================
// LocalStorage Utilities
// ============================================================================

/**
 * Save data to localStorage with prefix
 */
export function saveToStorage<T>(key: string, data: T, options: StorageOptions = {}): boolean {
  try {
    const fullKey = STORAGE_PREFIX + key;
    let value = JSON.stringify(data);

    if (options.ttl) {
      const item = {
        value,
        expiry: Date.now() + options.ttl
      };
      value = JSON.stringify(item);
    }

    localStorage.setItem(fullKey, value);
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return false;
  }
}

/**
 * Load data from localStorage
 */
export function loadFromStorage<T>(key: string, defaultValue?: T): T | undefined {
  try {
    const fullKey = STORAGE_PREFIX + key;
    const value = localStorage.getItem(fullKey);

    if (value === null) return defaultValue;

    const parsed = JSON.parse(value);

    // Check for TTL expiry
    if (parsed && typeof parsed === 'object' && 'expiry' in parsed) {
      if (Date.now() > parsed.expiry) {
        localStorage.removeItem(fullKey);
        return defaultValue;
      }
      return JSON.parse(parsed.value) as T;
    }

    return parsed as T;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return defaultValue;
  }
}

/**
 * Remove data from localStorage
 */
export function removeFromStorage(key: string): boolean {
  try {
    const fullKey = STORAGE_PREFIX + key;
    localStorage.removeItem(fullKey);
    return true;
  } catch (error) {
    console.error('Error removing from localStorage:', error);
    return false;
  }
}

/**
 * Clear all app data from localStorage
 */
export function clearStorage(): boolean {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(STORAGE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
    return true;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return false;
  }
}

/**
 * Get all keys from localStorage with prefix
 */
export function getStorageKeys(): string[] {
  try {
    return Object.keys(localStorage)
      .filter(key => key.startsWith(STORAGE_PREFIX))
      .map(key => key.slice(STORAGE_PREFIX.length));
  } catch (error) {
    console.error('Error getting storage keys:', error);
    return [];
  }
}

// ============================================================================
// Function Utilities
// ============================================================================

/**
 * Debounce function execution
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  delay = DEBOUNCE_DELAY_MS,
  options: DebounceOptions = {}
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  let lastCallTime = 0;

  return function (this: unknown, ...args: Parameters<T>) {
    const now = Date.now();
    const timeSinceLastCall = now - lastCallTime;

    const callNow = options.leading && timeSinceLastCall > delay;

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    if (callNow) {
      lastCallTime = now;
      func.apply(this, args);
    }

    if (options.trailing !== false) {
      timeoutId = setTimeout(() => {
        lastCallTime = Date.now();
        func.apply(this, args);
        timeoutId = undefined;
      }, delay);
    }
  };
}

/**
 * Throttle function execution
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  delay = DEBOUNCE_DELAY_MS
): (...args: Parameters<T>) => void {
  let lastCallTime = 0;
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  return function (this: unknown, ...args: Parameters<T>) {
    const now = Date.now();
    const timeSinceLastCall = now - lastCallTime;

    if (timeSinceLastCall >= delay) {
      lastCallTime = now;
      func.apply(this, args);
    } else if (!timeoutId) {
      timeoutId = setTimeout(() => {
        lastCallTime = Date.now();
        func.apply(this, args);
        timeoutId = undefined;
      }, delay - timeSinceLastCall);
    }
  };
}

/**
 * Create memoized version of function
 */
export function memoize<T extends (...args: unknown[]) => unknown>(
  func: T,
  resolver?: (...args: Parameters<T>) => string
): T {
  const cache = new Map<string, ReturnType<T>>();

  return function (this: unknown, ...args: Parameters<T>): ReturnType<T> {
    const key = resolver ? resolver(...args) : JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const result = func.apply(this, args) as ReturnType<T>;
    cache.set(key, result);
    return result;
  } as T;
}

/**
 * Retry function with exponential backoff
 */
export async function retry<T>(
  func: () => Promise<T>,
  maxAttempts = MAX_RETRY_ATTEMPTS,
  delay = RETRY_DELAY_MS
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await func();
    } catch (error) {
      lastError = error as Error;

      if (attempt < maxAttempts) {
        const backoffDelay = delay * Math.pow(2, attempt - 1);
        await sleep(backoffDelay);
      }
    }
  }

  throw lastError;
}

/**
 * Sleep for specified milliseconds
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Execute function with timeout
 */
export async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  timeoutError = 'Operation timed out'
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(timeoutError)), timeoutMs)
    )
  ]);
}

// ============================================================================
// Number Utilities
// ============================================================================

/**
 * Clamp number between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Round number to specified decimal places
 */
export function round(value: number, decimals = 0): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

/**
 * Format number with thousands separator
 */
export function formatNumber(value: number, locale = 'de-DE'): string {
  return new Intl.NumberFormat(locale).format(value);
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimals = 0): string {
  return `${round(value * 100, decimals)}%`;
}

/**
 * Generate random integer between min and max (inclusive)
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate random float between min and max
 */
export function randomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

/**
 * Check if number is in range
 */
export function inRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

// ============================================================================
// Date/Time Utilities
// ============================================================================

/**
 * Format date to string
 */
export function formatDate(date: Date, format = 'DD.MM.YYYY'): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return format
    .replace('DD', day)
    .replace('MM', month)
    .replace('YYYY', String(year))
    .replace('YY', String(year).slice(-2))
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
}

/**
 * Get relative time string
 */
export function getRelativeTime(date: Date, locale = 'de-DE'): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return 'gerade eben';
  if (minutes < 60) return `vor ${minutes} Minute${minutes > 1 ? 'n' : ''}`;
  if (hours < 24) return `vor ${hours} Stunde${hours > 1 ? 'n' : ''}`;
  if (days < 7) return `vor ${days} Tag${days > 1 ? 'en' : ''}`;
  if (days < 30) return `vor ${Math.floor(days / 7)} Woche${Math.floor(days / 7) > 1 ? 'n' : ''}`;
  if (days < 365) return `vor ${Math.floor(days / 30)} Monat${Math.floor(days / 30) > 1 ? 'en' : ''}`;
  return `vor ${Math.floor(days / 365)} Jahr${Math.floor(days / 365) > 1 ? 'en' : ''}`;
}

/**
 * Check if date is today
 */
export function isToday(date: Date): boolean {
  const today = new Date();
  return date.toDateString() === today.toDateString();
}

/**
 * Check if date is yesterday
 */
export function isYesterday(date: Date): boolean {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return date.toDateString() === yesterday.toDateString();
}

/**
 * Add days to date
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Get start of day
 */
export function startOfDay(date: Date): Date {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

/**
 * Get end of day
 */
export function endOfDay(date: Date): Date {
  const result = new Date(date);
  result.setHours(23, 59, 59, 999);
  return result;
}

// ============================================================================
// Validation Utilities
// ============================================================================

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate Spanish text (basic check for Spanish characters)
 */
export function isValidSpanishText(text: string): boolean {
  // Allow Spanish letters, spaces, punctuation
  const spanishRegex = /^[a-záéíóúüñ¿¡\s.,;:!?()\-'"]+$/i;
  return spanishRegex.test(text);
}

/**
 * Check if string is empty or whitespace
 */
export function isBlank(str: string): boolean {
  return !str || str.trim().length === 0;
}

// ============================================================================
// App-Specific Utilities
// ============================================================================

/**
 * Normalize answer for comparison
 */
export function normalizeAnswer(answer: string): string {
  return removeAccents(answer)
    .toLowerCase()
    .trim()
    .replace(/[¿¡]/g, '') // Remove Spanish question/exclamation marks
    .replace(/\s+/g, ' '); // Normalize whitespace
}

/**
 * Check if answer is correct
 */
export function checkAnswer(userAnswer: string, correctAnswer: string): boolean {
  return normalizeAnswer(userAnswer) === normalizeAnswer(correctAnswer);
}

/**
 * Calculate answer similarity (Levenshtein distance)
 */
export function calculateSimilarity(str1: string, str2: string): number {
  const s1 = normalizeAnswer(str1);
  const s2 = normalizeAnswer(str2);

  const matrix: number[][] = [];

  for (let i = 0; i <= s1.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= s2.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= s1.length; i++) {
    for (let j = 1; j <= s2.length; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  const distance = matrix[s1.length][s2.length];
  const maxLength = Math.max(s1.length, s2.length);

  return maxLength === 0 ? 1 : 1 - (distance / maxLength);
}

/**
 * Get exercise difficulty label
 */
export function getDifficultyLabel(difficulty: number): string {
  if (difficulty === 1) return 'Leicht';
  if (difficulty === 2) return 'Mittel';
  if (difficulty === 3) return 'Schwer';
  return 'Unbekannt';
}

/**
 * Get exercise type label
 */
export function getExerciseTypeLabel(type: ExerciseType | string): string {
  const labels: Record<string, string> = {
    'multiple-choice': 'Multiple Choice',
    'fill-blank': 'Lückentext',
    'translation': 'Übersetzung',
    'conjugation': 'Konjugation',
    'vocabulary-card': 'Vokabelkarte',
    'vocabulary': 'Vokabel',
    'sentence-building': 'Satz bauen',
    'conversation': 'Konversation',
    'comprehensive': 'Umfassend',
    'context-card': 'Kontextkarte',
    'reading-comprehension': 'Leseverständnis',
    'dialog': 'Dialog',
    'word-order': 'Wortreihenfolge'
  };

  return labels[type as string] || type;
}

/**
 * Format progress percentage
 */
export function formatProgress(current: number, total: number): string {
  if (total === 0) return '0%';
  const percentage = (current / total) * 100;
  return `${Math.round(percentage)}%`;
}

/**
 * Calculate learning streak
 */
export function calculateStreak(progress: UserProgress): number {
  const today = startOfDay(new Date());
  let streak = 0;

  // Check today
  if (isToday(new Date(progress.lastActivity))) {
    streak = 1;
  } else {
    return 0;
  }

  // Count consecutive days
  let checkDate = new Date(today);
  checkDate.setDate(checkDate.getDate() - 1);

  // This would need actual activity history
  // For now, return current streak from progress.stats
  return progress.stats?.streak || streak;
}

/**
 * Get achievement badge
 */
export function getAchievementBadge(achievementType: string): string {
  const badges: Record<string, string> = {
    'first-exercise': '🎯',
    'perfect-score': '💯',
    'streak-7': '🔥',
    'streak-30': '⭐',
    'unit-complete': '✅',
    'phase-complete': '🏆',
    'speed-demon': '⚡',
    'perfectionist': '💎',
    'dedicated-learner': '📚',
    'vocabulary-master': '📖'
  };

  return badges[achievementType] || '🏅';
}

/**
 * Show toast notification
 */
export function showToast(
  message: string,
  options: FeedbackOptions = {}
): void {
  const toast = createElement('div', {
    className: `toast toast-${options.type || 'info'}`,
    textContent: message
  });

  document.body.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add('toast-show');
  });

  // Auto dismiss
  if (options.autoDismiss !== false) {
    setTimeout(() => {
      toast.classList.remove('toast-show');
      setTimeout(() => removeElement(toast), 300);
    }, options.duration || 3000);
  }
}

/**
 * Show confirmation dialog
 */
export function showConfirmDialog(
  message: string,
  onConfirm: () => void,
  onCancel?: () => void
): void {
  const confirmed = confirm(message);
  if (confirmed) {
    onConfirm();
  } else if (onCancel) {
    onCancel();
  }
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    // Fallback for older browsers
    const textarea = createElement('textarea', {
      value: text,
      style: 'position: absolute; left: -9999px'
    });

    document.body.appendChild(textarea);
    textarea.select();

    try {
      document.execCommand('copy');
      removeElement(textarea);
      return true;
    } catch {
      removeElement(textarea);
      return false;
    }
  }
}

/**
 * Download data as file
 */
export function downloadFile(data: string, filename: string, mimeType = 'text/plain'): void {
  const blob = new Blob([data], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = createElement('a', {
    href: url,
    download: filename
  });

  document.body.appendChild(link);
  link.click();

  setTimeout(() => {
    removeElement(link);
    URL.revokeObjectURL(url);
  }, 100);
}

/**
 * Print element content
 */
export function printElement(element: HTMLElement): void {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Drucken</title>
        <style>
          body { font-family: Arial, sans-serif; }
          ${document.querySelector('style')?.textContent || ''}
        </style>
      </head>
      <body>${element.innerHTML}</body>
    </html>
  `);

  printWindow.document.close();
  printWindow.focus();

  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 250);
}

// ============================================================================
// Browser/Environment Utilities
// ============================================================================

/**
 * Check if running in browser
 */
export function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

/**
 * Check if mobile device
 */
export function isMobile(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

/**
 * Check if touch device
 */
export function isTouchDevice(): boolean {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

/**
 * Get browser name
 */
export function getBrowserName(): string {
  const ua = navigator.userAgent;
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Chrome')) return 'Chrome';
  if (ua.includes('Safari')) return 'Safari';
  if (ua.includes('Edge')) return 'Edge';
  if (ua.includes('MSIE') || ua.includes('Trident')) return 'IE';
  return 'Unknown';
}

/**
 * Check if online
 */
export function isOnline(): boolean {
  return navigator.onLine;
}

/**
 * Get viewport dimensions
 */
export function getViewport(): { width: number; height: number } {
  return {
    width: window.innerWidth || document.documentElement.clientWidth,
    height: window.innerHeight || document.documentElement.clientHeight
  };
}

/**
 * Check if element is in dark mode
 */
export function isDarkMode(): boolean {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/**
 * Check if reduced motion preferred
 */
export function prefersReducedMotion(): boolean {
  return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// ============================================================================
// Performance Utilities
// ============================================================================

/**
 * Measure execution time
 */
export async function measureTime<T>(
  fn: () => T | Promise<T>,
  label = 'Operation'
): Promise<T> {
  const start = performance.now();
  const result = await fn();
  const end = performance.now();
  console.log(`${label} took ${(end - start).toFixed(2)}ms`);
  return result;
}

/**
 * Request idle callback wrapper
 */
export function requestIdleCallback(callback: () => void, timeout = 1000): number {
  if ('requestIdleCallback' in window) {
    return (window as any).requestIdleCallback(callback, { timeout }) as number;
  }
  return setTimeout(callback, 1) as number;
}

/**
 * Cancel idle callback wrapper
 */
export function cancelIdleCallback(id: number): void {
  if ('cancelIdleCallback' in window) {
    (window as any).cancelIdleCallback(id);
  } else {
    clearTimeout(id);
  }
}

// ============================================================================
// Error Handling Utilities
// ============================================================================

/**
 * Safe JSON parse
 */
export function safeJsonParse<T = unknown>(
  json: string,
  defaultValue?: T
): T | undefined {
  try {
    return JSON.parse(json) as T;
  } catch {
    return defaultValue;
  }
}

/**
 * Safe function execution
 */
export function tryCatch<T>(
  fn: () => T,
  onError?: (error: Error) => T
): T | undefined {
  try {
    return fn();
  } catch (error) {
    if (onError) {
      return onError(error as Error);
    }
    console.error('Error in tryCatch:', error);
    return undefined;
  }
}

/**
 * Assert condition or throw error
 */
export function assert(condition: boolean, message: string): asserts condition {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

// Export all utilities as default object for backward compatibility
export default {
  // DOM
  querySelector,
  querySelectorAll,
  createElement,
  removeElement,
  addEventListenerWithCleanup,
  toggleClass,
  addClasses,
  removeClasses,
  hasClass,
  showElement,
  hideElement,
  isVisible,
  scrollIntoView,
  getElementOffset,
  isInViewport,
  animate,
  fadeIn,
  fadeOut,
  slideDown,
  slideUp,

  // String
  capitalize,
  toTitleCase,
  truncate,
  stripHtml,
  escapeHtml,
  unescapeHtml,
  kebabToCamel,
  camelToKebab,
  removeAccents,
  compareStringsLoose,
  containsIgnoreCase,
  countWords,
  randomString,
  generateUUID,
  slugify,

  // Array
  shuffle,
  randomElement,
  randomElements,
  unique,
  uniqueBy,
  groupBy,
  chunk,
  flatten,
  partition,
  findLast,
  sum,
  average,
  median,
  min,
  max,
  sortBy,

  // Object
  deepClone,
  deepMerge,
  isObject,
  getNestedProperty,
  setNestedProperty,
  pick,
  omit,
  isEmpty,

  // Storage
  saveToStorage,
  loadFromStorage,
  removeFromStorage,
  clearStorage,
  getStorageKeys,

  // Function
  debounce,
  throttle,
  memoize,
  retry,
  sleep,
  withTimeout,

  // Number
  clamp,
  round,
  formatNumber,
  formatPercentage,
  randomInt,
  randomFloat,
  inRange,

  // Date/Time
  formatDate,
  getRelativeTime,
  isToday,
  isYesterday,
  addDays,
  startOfDay,
  endOfDay,

  // Validation
  isValidEmail,
  isValidUrl,
  isValidSpanishText,
  isBlank,

  // App-specific
  normalizeAnswer,
  checkAnswer,
  calculateSimilarity,
  getDifficultyLabel,
  getExerciseTypeLabel,
  formatProgress,
  calculateStreak,
  getAchievementBadge,
  showToast,
  showConfirmDialog,
  copyToClipboard,
  downloadFile,
  printElement,

  // Browser
  isBrowser,
  isMobile,
  isTouchDevice,
  getBrowserName,
  isOnline,
  getViewport,
  isDarkMode,
  prefersReducedMotion,

  // Performance
  measureTime,
  requestIdleCallback,
  cancelIdleCallback,

  // Error handling
  safeJsonParse,
  tryCatch,
  assert
};
