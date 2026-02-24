export default {
    extends: ['@commitlint/config-conventional'],
    rules: {
        // Enforce conventional commit types
        'type-enum': [
            2,
            'always',
            [
                'feat',
                'fix',
                'docs',
                'style',
                'refactor',
                'perf',
                'test',
                'chore',
                'ci',
                'build',
                'revert',
            ],
        ],
        // Require a scope
        'scope-empty': [1, 'never'],
        // Subject must not be empty
        'subject-empty': [2, 'never'],
        // Subject must not end with a period
        'subject-full-stop': [2, 'never', '.'],
        // Disable strict casing — SPEC-IDs in refs contain uppercase
        'subject-case': [0],
    },
};
