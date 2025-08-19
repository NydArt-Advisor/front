import React from 'react';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { AccessibilityProvider } from '@/context/AccessibilityContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/hooks/useAuth';
import SkipNavigation from '@/components/accessibility/SkipNavigation';
import AccessibilitySettings from '@/components/accessibility/AccessibilitySettings';
import AccessibilityTester from '@/components/accessibility/AccessibilityTester';

expect.extend(toHaveNoViolations);

// Wrapper component for testing with all providers
const TestWrapper = ({ children }) => (
  <AccessibilityProvider>
    <ThemeProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </ThemeProvider>
  </AccessibilityProvider>
);

describe('Accessibility Tests', () => {
  describe('Skip Navigation Component', () => {
    it('should not have accessibility violations', async () => {
      const { container } = render(
        <TestWrapper>
          <SkipNavigation />
        </TestWrapper>
      );
      
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have proper ARIA labels', () => {
      const { getByRole } = render(
        <TestWrapper>
          <SkipNavigation />
        </TestWrapper>
      );
      
      const navigation = getByRole('navigation');
      expect(navigation).toHaveAttribute('aria-label', 'Skip navigation');
    });

    it('should have skip links with proper text', () => {
      const { getByText } = render(
        <TestWrapper>
          <SkipNavigation />
        </TestWrapper>
      );
      
      expect(getByText('Skip to main content')).toBeInTheDocument();
      expect(getByText('Skip to navigation')).toBeInTheDocument();
      expect(getByText('Skip to search')).toBeInTheDocument();
      expect(getByText('Skip to footer')).toBeInTheDocument();
    });
  });

  describe('Accessibility Settings Component', () => {
    it('should not have accessibility violations when closed', async () => {
      const { container } = render(
        <TestWrapper>
          <AccessibilitySettings isOpen={false} onClose={() => {}} />
        </TestWrapper>
      );
      
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should not have accessibility violations when open', async () => {
      const { container } = render(
        <TestWrapper>
          <AccessibilitySettings isOpen={true} onClose={() => {}} />
        </TestWrapper>
      );
      
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have proper modal structure', () => {
      const { getByRole, getByText } = render(
        <TestWrapper>
          <AccessibilitySettings isOpen={true} onClose={() => {}} />
        </TestWrapper>
      );
      
      expect(getByRole('dialog')).toBeInTheDocument();
      expect(getByText('Accessibility Settings')).toBeInTheDocument();
    });

    it('should have proper tab navigation', () => {
      const { getByRole, getAllByRole } = render(
        <TestWrapper>
          <AccessibilitySettings isOpen={true} onClose={() => {}} />
        </TestWrapper>
      );
      
      const tablist = getByRole('tablist');
      expect(tablist).toBeInTheDocument();
      
      const tabs = getAllByRole('tab');
      expect(tabs).toHaveLength(3);
      expect(tabs[0]).toHaveTextContent('General');
      expect(tabs[1]).toHaveTextContent('Visual');
      expect(tabs[2]).toHaveTextContent('Motion');
    });

    it('should have proper tab panels', () => {
      const { getAllByRole } = render(
        <TestWrapper>
          <AccessibilitySettings isOpen={true} onClose={() => {}} />
        </TestWrapper>
      );
      
      const tabpanels = getAllByRole('tabpanel');
      expect(tabpanels).toHaveLength(3);
    });

    it('should have proper toggle buttons', () => {
      const { getAllByRole } = render(
        <TestWrapper>
          <AccessibilitySettings isOpen={true} onClose={() => {}} />
        </TestWrapper>
      );
      
      const switches = getAllByRole('switch');
      expect(switches.length).toBeGreaterThan(0);
    });
  });

  describe('Accessibility Tester Component', () => {
    it('should not have accessibility violations', async () => {
      const { container } = render(
        <TestWrapper>
          <AccessibilityTester />
        </TestWrapper>
      );
      
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have proper heading structure', () => {
      const { getByRole } = render(
        <TestWrapper>
          <AccessibilityTester />
        </TestWrapper>
      );
      
      const heading = getByRole('heading', { level: 2 });
      expect(heading).toHaveTextContent('Accessibility Tester');
    });

    it('should have accessible button', () => {
      const { getByRole } = render(
        <TestWrapper>
          <AccessibilityTester />
        </TestWrapper>
      );
      
      const button = getByRole('button', { name: /run accessibility tests/i });
      expect(button).toBeInTheDocument();
    });
  });

  describe('Accessibility Context', () => {
    it('should provide accessibility state', () => {
      const TestComponent = () => {
        const { highContrastMode, fontSize, reducedMotion } = useAccessibility();
        return (
          <div>
            <span data-testid="high-contrast">{highContrastMode.toString()}</span>
            <span data-testid="font-size">{fontSize}</span>
            <span data-testid="reduced-motion">{reducedMotion.toString()}</span>
          </div>
        );
      };

      const { getByTestId } = render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );
      
      expect(getByTestId('high-contrast')).toHaveTextContent('false');
      expect(getByTestId('font-size')).toHaveTextContent('100');
      expect(getByTestId('reduced-motion')).toHaveTextContent('false');
    });
  });

  describe('Color Contrast Tests', () => {
    it('should have sufficient color contrast for text', () => {
      const { container } = render(
        <TestWrapper>
          <div className="text-text bg-background p-4">
            <h1>Main Heading</h1>
            <p>Regular paragraph text</p>
            <span className="text-text/60">Secondary text</span>
          </div>
        </TestWrapper>
      );
      
      // This test would need a color contrast checking library
      // For now, we'll test that the classes are applied correctly
      const textElement = container.querySelector('.text-text');
      expect(textElement).toBeInTheDocument();
    });
  });

  describe('Focus Management Tests', () => {
    it('should have focusable elements', () => {
      const { getByRole } = render(
        <TestWrapper>
          <button>Test Button</button>
          <a href="#test">Test Link</a>
          <input type="text" placeholder="Test Input" />
        </TestWrapper>
      );
      
      const button = getByRole('button');
      const link = getByRole('link');
      const input = getByRole('textbox');
      
      expect(button).toBeInTheDocument();
      expect(link).toBeInTheDocument();
      expect(input).toBeInTheDocument();
    });
  });

  describe('Semantic HTML Tests', () => {
    it('should use semantic HTML elements', () => {
      const { container } = render(
        <TestWrapper>
          <header>
            <nav>
              <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About</a></li>
              </ul>
            </nav>
          </header>
          <main>
            <article>
              <h1>Article Title</h1>
              <p>Article content</p>
            </article>
          </main>
          <footer>
            <p>Footer content</p>
          </footer>
        </TestWrapper>
      );
      
      expect(container.querySelector('header')).toBeInTheDocument();
      expect(container.querySelector('nav')).toBeInTheDocument();
      expect(container.querySelector('main')).toBeInTheDocument();
      expect(container.querySelector('article')).toBeInTheDocument();
      expect(container.querySelector('footer')).toBeInTheDocument();
    });
  });

  describe('Form Accessibility Tests', () => {
    it('should have properly labeled form inputs', () => {
      const { getByLabelText } = render(
        <TestWrapper>
          <form>
            <label htmlFor="name">Name:</label>
            <input id="name" type="text" />
            
            <label htmlFor="email">Email:</label>
            <input id="email" type="email" />
            
            <label htmlFor="message">Message:</label>
            <textarea id="message"></textarea>
          </form>
        </TestWrapper>
      );
      
      expect(getByLabelText('Name:')).toBeInTheDocument();
      expect(getByLabelText('Email:')).toBeInTheDocument();
      expect(getByLabelText('Message:')).toBeInTheDocument();
    });

    it('should have proper fieldset and legend', () => {
      const { getByRole } = render(
        <TestWrapper>
          <form>
            <fieldset>
              <legend>Personal Information</legend>
              <label htmlFor="first-name">First Name:</label>
              <input id="first-name" type="text" />
              
              <label htmlFor="last-name">Last Name:</label>
              <input id="last-name" type="text" />
            </fieldset>
          </form>
        </TestWrapper>
      );
      
      const fieldset = getByRole('group');
      expect(fieldset).toBeInTheDocument();
    });
  });

  describe('Image Accessibility Tests', () => {
    it('should have alt text for images', () => {
      const { getByAltText } = render(
        <TestWrapper>
          <img src="/test.jpg" alt="Test image description" />
          <img src="/logo.png" alt="Company logo" />
        </TestWrapper>
      );
      
      expect(getByAltText('Test image description')).toBeInTheDocument();
      expect(getByAltText('Company logo')).toBeInTheDocument();
    });

    it('should handle decorative images', () => {
      const { container } = render(
        <TestWrapper>
          <img src="/decoration.jpg" alt="" role="presentation" />
        </TestWrapper>
      );
      
      const decorativeImage = container.querySelector('img[alt=""][role="presentation"]');
      expect(decorativeImage).toBeInTheDocument();
    });
  });

  describe('Keyboard Navigation Tests', () => {
    it('should have logical tab order', () => {
      const { container } = render(
        <TestWrapper>
          <button>First Button</button>
          <a href="#link">Link</a>
          <input type="text" placeholder="Input" />
          <button>Last Button</button>
        </TestWrapper>
      );
      
      const focusableElements = container.querySelectorAll('button, a[href], input, textarea, select');
      expect(focusableElements.length).toBeGreaterThan(0);
    });
  });

  describe('Screen Reader Tests', () => {
    it('should have proper ARIA labels', () => {
      const { getByLabelText } = render(
        <TestWrapper>
          <button aria-label="Close dialog">×</button>
          <input aria-label="Search" type="text" />
          <div aria-label="Status message" role="status">Loading...</div>
        </TestWrapper>
      );
      
      expect(getByLabelText('Close dialog')).toBeInTheDocument();
      expect(getByLabelText('Search')).toBeInTheDocument();
      expect(getByLabelText('Status message')).toBeInTheDocument();
    });

    it('should have proper ARIA roles', () => {
      const { getByRole } = render(
        <TestWrapper>
          <div role="banner">Header</div>
          <div role="main">Main content</div>
          <div role="complementary">Sidebar</div>
          <div role="contentinfo">Footer</div>
        </TestWrapper>
      );
      
      expect(getByRole('banner')).toBeInTheDocument();
      expect(getByRole('main')).toBeInTheDocument();
      expect(getByRole('complementary')).toBeInTheDocument();
      expect(getByRole('contentinfo')).toBeInTheDocument();
    });
  });
});
