# TypeScript Development Guide

## 📚 Overview

The Spanish Learning App is undergoing a gradual migration from JavaScript to TypeScript. This document provides essential information for developers working with TypeScript in this project.

## 🚀 Quick Start

### Installation

```bash
# Install dependencies (includes TypeScript)
npm install
```

### Development Workflow

```bash
# Start TypeScript compiler in watch mode (auto-recompile on file changes)
npm run dev

# Type-check without emitting files
npm run type-check

# Build for production
npm run build

# Strict type checking (use to verify migration progress)
npm run migrate-check
```

### File Structure

```
Spanish-App/
├── types/
│   ├── core.ts          # Core type definitions (Exercise, ValidationResult, etc.)
│   └── globals.d.ts     # Global window objects and third-party types
├── js/
│   ├── config/
│   │   ├── environment.ts  # ✅ Migrated to TypeScript
│   │   └── environment.js  # Original (can be deleted after testing)
│   ├── app-core.js         # ⏳ To be migrated
│   ├── utils.js            # ⏳ To be migrated
│   └── ...                 # Other JavaScript modules
├── dist/                   # Generated JavaScript output (gitignored)
├── tsconfig.json           # TypeScript configuration
├── package.json            # Dependencies and scripts
└── MIGRATION-PLAN.md       # Detailed migration strategy
```

## 📖 Core Type Definitions

All core types are defined in `types/core.ts`. Import them as needed:

```typescript
import type {
  Exercise,
  ValidationResult,
  UserProgress,
  KnowledgeItem,
  ExerciseType,
  DifficultyLevel
} from '../types/core';
```

### Key Interfaces

#### Exercise
```typescript
interface Exercise {
  id: string;
  type: ExerciseType;
  unit: number;
  concept: string;
  question: string;
  correctAnswer: string;
  options?: string[];
  hint?: string;
  explanation?: string;
  // ... and more
}
```

#### ValidationResult
```typescript
interface ValidationResult {
  isCorrect: boolean;
  isAcceptable: boolean;
  coreErrors: string[];
  styleImprovements: StyleImprovement[];
  feedback: ValidationFeedback;
}
```

#### UserProgress
```typescript
interface UserProgress {
  currentUnit: number;
  currentIndex: number;
  completedExercises: string[];
  stats: ProgressStats;
  knowledgeState: Record<string, KnowledgeItem>;
  settings: UserSettings;
}
```

**See `types/core.ts` for complete documentation of all 40+ interfaces.**

## 🔧 TypeScript Configuration

### Current Configuration (`tsconfig.json`)

The TypeScript configuration is intentionally **permissive** to support gradual migration:

- ✅ `allowJs: true` - JavaScript files can coexist with TypeScript
- ✅ `checkJs: false` - Don't type-check JavaScript files (yet)
- ✅ `strict: false` - Permissive type checking (will be enabled in Phase 5)
- ✅ `noEmitOnError: false` - Compilation continues even with type errors

**This configuration will be tightened as migration progresses.**

### Future Configuration (Phase 5: Strict Mode)

Once all modules are migrated:
- 🔄 `strict: true` - Enable all strict type checking
- 🔄 `noImplicitAny: true` - No implicit `any` types
- 🔄 `strictNullChecks: true` - Strict null/undefined checking

## 🎯 Migration Guidelines

### How to Migrate a JavaScript File

1. **Rename** `.js` → `.ts`
   ```bash
   mv js/my-module.js js/my-module.ts
   ```

2. **Add type imports**
   ```typescript
   import type { Exercise, ValidationResult } from '../types/core';
   ```

3. **Add type annotations to function signatures**
   ```typescript
   // Before (JS)
   function validateAnswer(userAnswer, correctAnswer, exercise) {
     // ...
   }

   // After (TS)
   function validateAnswer(
     userAnswer: string,
     correctAnswer: string,
     exercise: Exercise
   ): ValidationResult {
     // ...
   }
   ```

4. **Add types to class properties**
   ```typescript
   class ExerciseLoader {
     private exercises: Exercise[] = [];
     private currentIndex: number = 0;

     // ...
   }
   ```

5. **Test compilation**
   ```bash
   npm run type-check
   ```

6. **Fix any type errors**

7. **Test functionality in browser**

8. **Commit your changes**

### Best Practices

#### ✅ DO

- Use explicit type annotations for function parameters and return types
- Use `interface` for object shapes
- Use `type` for unions, intersections, and primitives
- Import types with `import type { ... }` for better tree-shaking
- Add JSDoc comments to exported functions
- Use type guards for narrowing types

#### ❌ DON'T

- Don't use `any` unless absolutely necessary (use `unknown` instead)
- Don't suppress errors with `@ts-ignore` without documentation
- Don't create new global variables without declaring them in `types/globals.d.ts`
- Don't change functionality during migration (only add types)

### Example Migration

**Before (JavaScript):**
```javascript
// js/my-validator.js
class MyValidator {
  constructor() {
    this.errors = [];
  }

  validate(input) {
    if (!input) {
      this.errors.push('Input required');
      return false;
    }
    return true;
  }

  getErrors() {
    return this.errors;
  }
}

window.MyValidator = MyValidator;
```

**After (TypeScript):**
```typescript
// js/my-validator.ts
/**
 * Custom validator for user input
 */
export class MyValidator {
  private errors: string[] = [];

  /**
   * Validate user input
   * @param input - User input to validate
   * @returns true if valid, false otherwise
   */
  public validate(input: string | null | undefined): boolean {
    if (!input) {
      this.errors.push('Input required');
      return false;
    }
    return true;
  }

  /**
   * Get all validation errors
   */
  public getErrors(): string[] {
    return [...this.errors]; // Defensive copy
  }
}

// Declare global type
declare global {
  interface Window {
    MyValidator: typeof MyValidator;
  }
}

// Attach to window for backwards compatibility
window.MyValidator = MyValidator;
```

## 🧪 Testing Your TypeScript Code

### Type Checking

```bash
# Check types without emitting files
npm run type-check

# Check with strict mode (for migration verification)
npm run migrate-check
```

### Runtime Testing

1. Build the TypeScript:
   ```bash
   npm run build
   ```

2. Open `index.html` in a browser (use Live Server or local server)

3. Open browser console and verify:
   - No JavaScript errors
   - All 225 exercises work correctly
   - Features function identically to before

### Manual Test Checklist

After migrating a module:
- [ ] TypeScript compiles without errors
- [ ] App loads in browser without errors
- [ ] Can navigate through exercises
- [ ] Answer validation works correctly
- [ ] Progress is saved and restored
- [ ] Settings work correctly
- [ ] No console errors

## 📊 Migration Progress

### Phase 1: Infrastructure Setup ✅ COMPLETED
- [x] TypeScript installed
- [x] `tsconfig.json` configured
- [x] Core types defined (`types/core.ts`)
- [x] Global types defined (`types/globals.d.ts`)
- [x] Build scripts created
- [x] Documentation created

### Phase 2: Utility Modules (Current Phase)
- [x] `js/config/environment.js` → `js/config/environment.ts` ✅
- [ ] `js/utils.js` → Split and migrate
- [ ] `js/monitoring.js` → Migrate
- [ ] `js/error-handling.js` → Migrate

### Phase 3: Core Logic
- [ ] `js/tolerant-validator.js`
- [ ] `js/improved-feedback.js`
- [ ] `js/data-manager.js`
- [ ] `js/app-core.js` (Critical)

### Phase 4: Advanced Systems
- [ ] `js/adaptive-learning.js`
- [ ] `js/adaptive-practice-system.js`
- [ ] `js/level-test-system.js`
- [ ] `js/performance-optimizations.js`
- [ ] `js/production-config.js`

### Phase 5: Strict Mode
- [ ] Enable `strict: true`
- [ ] Enable `noImplicitAny: true`
- [ ] Enable `strictNullChecks: true`
- [ ] Fix all strict mode errors
- [ ] Aim for zero `any` types

**See `MIGRATION-PLAN.md` for detailed migration strategy.**

## 🐛 Common Issues & Solutions

### Issue: "Cannot find module" error

**Problem**: TypeScript can't find imported types

**Solution**: Ensure import path is correct and uses relative paths
```typescript
// ✅ Correct
import type { Exercise } from '../types/core';

// ❌ Incorrect
import type { Exercise } from 'types/core';
```

### Issue: "Property 'X' does not exist on type 'Window'"

**Problem**: Global window object not declared

**Solution**: Add declaration to `types/globals.d.ts`
```typescript
declare global {
  interface Window {
    X: YourType;
  }
}
```

### Issue: "Type 'X' is not assignable to type 'Y'"

**Problem**: Type mismatch

**Solution**:
1. Check if types are correct
2. Use type assertion if you're certain: `value as TargetType`
3. Add proper type guards for narrowing

### Issue: Compilation is slow

**Solution**:
1. Use `npm run type-check` instead of `npm run build` during development
2. Use `npm run dev` for watch mode (incremental compilation)
3. Close unused TypeScript files in your editor

## 📚 Resources

### Official TypeScript Documentation
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Do's and Don'ts](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)
- [Migrating from JavaScript](https://www.typescriptlang.org/docs/handbook/migrating-from-javascript.html)

### Project Documentation
- `MIGRATION-PLAN.md` - Detailed migration strategy and timeline
- `types/core.ts` - Core type definitions with JSDoc
- `types/globals.d.ts` - Global type declarations

### IDE Setup

#### VS Code (Recommended)
- Install: "ESLint" extension
- TypeScript is built-in, no extension needed
- Features: IntelliSense, auto-import, type hints, refactoring

#### WebStorm
- TypeScript support is built-in
- Enable TypeScript service in settings

## 🎉 Benefits of TypeScript

### Immediate Benefits (After Phase 2)
- ✨ IntelliSense and autocomplete in IDE
- 🐛 Catch typos and wrong function arguments at compile-time
- 📖 Self-documenting code (types as documentation)
- 🔍 Better code navigation (Go to Definition, Find References)

### Medium-term Benefits (After Phase 3)
- ♻️ Refactoring safety (rename, move files confidently)
- 🏗️ Easier to understand complex systems
- 👥 Easier onboarding for new developers

### Long-term Benefits (After Phase 5)
- 🚀 Fewer runtime errors in production
- 📦 Easier to add new features (Phases 2-5 expansion)
- 🧪 Better testability
- 🌍 Better IDE support across all editors

## 💬 Questions?

- Check `types/core.ts` for type definitions and documentation
- See `MIGRATION-PLAN.md` for migration strategy
- Create an issue in the repository for migration questions

---

**Last Updated**: 2025-10-31
**Current Phase**: Phase 2 - Utility Modules
**Migration Status**: 7% complete (1/14 modules migrated)
