import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

describe('App', () => {
    it('renders without crashing', () => {
        render(
            <BrowserRouter>
                <App />
            </BrowserRouter>
        );
        // Check for main navigation
        expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    it('renders main routes', () => {
        render(
            <BrowserRouter>
                <App />
            </BrowserRouter>
        );
        // Check for common elements that should be present
        expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    it('has proper accessibility attributes', () => {
        render(
            <BrowserRouter>
                <App />
            </BrowserRouter>
        );
        // Check for navigation landmark
        const nav = screen.getByRole('navigation');
        expect(nav).toBeInTheDocument();
        expect(nav).toHaveAttribute('aria-label');
    });
});
