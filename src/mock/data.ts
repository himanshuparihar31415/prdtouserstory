import type { Module, Workflow, Suggestion, Story, SubTask, ConsolidatedData, Project } from '../types';

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'proj-001',
    name: 'E-Commerce Platform',
    description: 'Full-featured online shopping platform with catalog, cart, checkout, and order management.',
    currentStep: 1,
    createdAt: '2026-04-10T09:00:00Z',
  },
];

export const MOCK_CONSOLIDATED: ConsolidatedData = {
  summary:
    'The E-Commerce Platform is a full-stack online shopping solution that enables users to browse a product catalog, manage shopping carts, complete secure checkout flows, and track orders. The platform includes role-based access for customers and administrators, with dedicated modules for product management, inventory, payments, and fulfillment. The system integrates with third-party payment gateways and shipping providers, while providing real-time inventory updates and order status notifications.',
  uiStructure: {
    pages: ['Home / Landing', 'Product Catalog', 'Product Detail', 'Cart', 'Checkout', 'Order Confirmation', 'Order History', 'Admin Dashboard', 'Product Management', 'User Profile'],
    navigationPattern: 'Top navbar with category nav, breadcrumbs for deep pages, bottom cart summary bar',
    keyComponents: ['ProductCard', 'CartSidebar', 'CheckoutStepper', 'OrderTimeline', 'AdminTable', 'SearchBar', 'FilterPanel'],
  },
  relationships: [
    { from: 'Auth', to: 'Cart', type: 'depends_on' },
    { from: 'Cart', to: 'Checkout', type: 'integrates_with' },
    { from: 'Checkout', to: 'Orders', type: 'shares_data' },
    { from: 'Product Catalog', to: 'Cart', type: 'shares_data' },
  ],
};

export const MOCK_MODULES: Module[] = [
  {
    id: 'mod-auth',
    name: 'Authentication & User Management',
    description: 'Handles user registration, login, profile management, and role-based access control.',
    order: 0,
    isApproved: false,
    features: [
      {
        id: 'feat-auth-1',
        moduleId: 'mod-auth',
        name: 'User Registration',
        description: 'New user sign-up with email/password or OAuth (Google, Facebook).',
        subFeatures: [
          { id: 'sf-1', name: 'Email Verification', description: 'Verify email after registration' },
          { id: 'sf-2', name: 'OAuth Integration', description: 'Sign up via Google or Facebook' },
        ],
      },
      {
        id: 'feat-auth-2',
        moduleId: 'mod-auth',
        name: 'Login & Session Management',
        description: 'Secure login with JWT tokens, refresh token rotation, and remember-me.',
        subFeatures: [
          { id: 'sf-3', name: 'Remember Me', description: 'Persist session across browser restarts' },
          { id: 'sf-4', name: 'Multi-device Session', description: 'View and revoke active sessions' },
        ],
      },
      {
        id: 'feat-auth-3',
        moduleId: 'mod-auth',
        name: 'Role-Based Access Control',
        description: 'Customer, Admin, and Super-Admin roles with permission matrices.',
        subFeatures: [],
      },
    ],
  },
  {
    id: 'mod-catalog',
    name: 'Product Catalog',
    description: 'Browse, search, and filter products with detailed pages, images, and reviews.',
    order: 1,
    isApproved: false,
    features: [
      {
        id: 'feat-cat-1',
        moduleId: 'mod-catalog',
        name: 'Product Listing',
        description: 'Paginated product grid with sorting and filtering by category, price, rating.',
        subFeatures: [
          { id: 'sf-5', name: 'Advanced Filters', description: 'Multi-select category, price range, brand filters' },
          { id: 'sf-6', name: 'Sort Options', description: 'Sort by relevance, price, rating, newest' },
        ],
      },
      {
        id: 'feat-cat-2',
        moduleId: 'mod-catalog',
        name: 'Product Detail Page',
        description: 'Full product page with image gallery, description, variants (size/color), stock status.',
        subFeatures: [
          { id: 'sf-7', name: 'Image Gallery', description: 'Zoomable multi-image gallery' },
          { id: 'sf-8', name: 'Product Variants', description: 'Select size, color, quantity' },
        ],
      },
      {
        id: 'feat-cat-3',
        moduleId: 'mod-catalog',
        name: 'Search',
        description: 'Full-text search with autocomplete, spell correction, and recent searches.',
        subFeatures: [],
      },
    ],
  },
  {
    id: 'mod-cart',
    name: 'Cart & Checkout',
    description: 'Shopping cart management, coupon application, and multi-step secure checkout.',
    order: 2,
    isApproved: false,
    features: [
      {
        id: 'feat-cart-1',
        moduleId: 'mod-cart',
        name: 'Shopping Cart',
        description: 'Add/remove/update items, persistent cart across sessions.',
        subFeatures: [
          { id: 'sf-9', name: 'Guest Cart', description: 'Allow cart without login, merge on sign-in' },
          { id: 'sf-10', name: 'Coupon Codes', description: 'Apply discount codes to cart total' },
        ],
      },
      {
        id: 'feat-cart-2',
        moduleId: 'mod-cart',
        name: 'Checkout Flow',
        description: 'Multi-step checkout: address → shipping → payment → review.',
        subFeatures: [
          { id: 'sf-11', name: 'Address Management', description: 'Save and select delivery addresses' },
          { id: 'sf-12', name: 'Shipping Options', description: 'Standard, express, same-day shipping' },
        ],
      },
      {
        id: 'feat-cart-3',
        moduleId: 'mod-cart',
        name: 'Payment Processing',
        description: 'Credit/debit card, UPI, net banking, and wallet payments via payment gateway.',
        subFeatures: [],
      },
    ],
  },
  {
    id: 'mod-orders',
    name: 'Order Management',
    description: 'Order tracking, history, returns, and refunds for customers and admins.',
    order: 3,
    isApproved: false,
    features: [
      {
        id: 'feat-ord-1',
        moduleId: 'mod-orders',
        name: 'Order Tracking',
        description: 'Real-time order status with timeline and map-based tracking.',
        subFeatures: [
          { id: 'sf-13', name: 'Status Notifications', description: 'Email/SMS alerts on order status change' },
        ],
      },
      {
        id: 'feat-ord-2',
        moduleId: 'mod-orders',
        name: 'Order History',
        description: 'View past orders with reorder capability and invoice download.',
        subFeatures: [],
      },
      {
        id: 'feat-ord-3',
        moduleId: 'mod-orders',
        name: 'Returns & Refunds',
        description: 'Initiate returns within policy window, track refund status.',
        subFeatures: [],
      },
    ],
  },
];

export const MOCK_WORKFLOWS: Workflow[] = [
  {
    id: 'wf-001',
    name: 'User Registration & Onboarding Flow',
    description: 'Complete journey from landing page to first purchase for a new user.',
    isApproved: false,
    steps: [
      { id: 's1', label: 'Land on Homepage', description: 'User arrives at the platform', type: 'start', nextSteps: ['s2'] },
      { id: 's2', label: 'Click Sign Up', description: 'User initiates registration', type: 'action', nextSteps: ['s3'] },
      { id: 's3', label: 'Choose Method', description: 'Email or OAuth', type: 'decision', nextSteps: ['s4', 's5'], conditions: { s4: 'Email', s5: 'OAuth' } },
      { id: 's4', label: 'Fill Registration Form', description: 'Enter name, email, password', type: 'action', nextSteps: ['s6'] },
      { id: 's5', label: 'OAuth Auth', description: 'Redirect to provider', type: 'action', nextSteps: ['s7'] },
      { id: 's6', label: 'Verify Email', description: 'Click verification link', type: 'action', nextSteps: ['s7'] },
      { id: 's7', label: 'Account Created', description: 'Profile setup complete', type: 'end', nextSteps: [] },
    ],
    diagramData: {
      nodes: [
        { id: 's1', type: 'flowNode', position: { x: 0, y: 0 }, data: { label: 'Land on Homepage', nodeType: 'start' } },
        { id: 's2', type: 'flowNode', position: { x: 0, y: 100 }, data: { label: 'Click Sign Up', nodeType: 'action' } },
        { id: 's3', type: 'flowNode', position: { x: 0, y: 200 }, data: { label: 'Choose Method', nodeType: 'decision' } },
        { id: 's4', type: 'flowNode', position: { x: -150, y: 320 }, data: { label: 'Fill Registration Form', nodeType: 'action' } },
        { id: 's5', type: 'flowNode', position: { x: 150, y: 320 }, data: { label: 'OAuth Auth', nodeType: 'action' } },
        { id: 's6', type: 'flowNode', position: { x: -150, y: 440 }, data: { label: 'Verify Email', nodeType: 'action' } },
        { id: 's7', type: 'flowNode', position: { x: 0, y: 560 }, data: { label: 'Account Created', nodeType: 'end' } },
      ],
      edges: [
        { id: 'e1', source: 's1', target: 's2' },
        { id: 'e2', source: 's2', target: 's3' },
        { id: 'e3', source: 's3', target: 's4', label: 'Email' },
        { id: 'e4', source: 's3', target: 's5', label: 'OAuth' },
        { id: 'e5', source: 's4', target: 's6' },
        { id: 'e6', source: 's5', target: 's7' },
        { id: 'e7', source: 's6', target: 's7' },
      ],
    },
  },
  {
    id: 'wf-002',
    name: 'Product Discovery & Purchase Flow',
    description: 'From browsing the catalog to completing a purchase.',
    isApproved: false,
    steps: [
      { id: 'p1', label: 'Browse Catalog', description: 'User explores product listing', type: 'start', nextSteps: ['p2'] },
      { id: 'p2', label: 'Search / Filter', description: 'Apply search or filters', type: 'action', nextSteps: ['p3'] },
      { id: 'p3', label: 'View Product Detail', description: 'Open product page', type: 'action', nextSteps: ['p4'] },
      { id: 'p4', label: 'Add to Cart', description: 'Select variant and quantity', type: 'action', nextSteps: ['p5'] },
      { id: 'p5', label: 'Proceed to Checkout', description: 'Initiate checkout', type: 'action', nextSteps: ['p6'] },
      { id: 'p6', label: 'Payment Success?', description: 'Payment gateway response', type: 'decision', nextSteps: ['p7', 'p8'], conditions: { p7: 'Success', p8: 'Failure' } },
      { id: 'p7', label: 'Order Confirmed', description: 'Order placed successfully', type: 'end', nextSteps: [] },
      { id: 'p8', label: 'Retry Payment', description: 'Show error, allow retry', type: 'action', nextSteps: ['p5'] },
    ],
    diagramData: {
      nodes: [
        { id: 'p1', type: 'flowNode', position: { x: 0, y: 0 }, data: { label: 'Browse Catalog', nodeType: 'start' } },
        { id: 'p2', type: 'flowNode', position: { x: 0, y: 100 }, data: { label: 'Search / Filter', nodeType: 'action' } },
        { id: 'p3', type: 'flowNode', position: { x: 0, y: 200 }, data: { label: 'View Product Detail', nodeType: 'action' } },
        { id: 'p4', type: 'flowNode', position: { x: 0, y: 300 }, data: { label: 'Add to Cart', nodeType: 'action' } },
        { id: 'p5', type: 'flowNode', position: { x: 0, y: 400 }, data: { label: 'Proceed to Checkout', nodeType: 'action' } },
        { id: 'p6', type: 'flowNode', position: { x: 0, y: 500 }, data: { label: 'Payment Success?', nodeType: 'decision' } },
        { id: 'p7', type: 'flowNode', position: { x: -150, y: 620 }, data: { label: 'Order Confirmed', nodeType: 'end' } },
        { id: 'p8', type: 'flowNode', position: { x: 150, y: 620 }, data: { label: 'Retry Payment', nodeType: 'action' } },
      ],
      edges: [
        { id: 'ep1', source: 'p1', target: 'p2' },
        { id: 'ep2', source: 'p2', target: 'p3' },
        { id: 'ep3', source: 'p3', target: 'p4' },
        { id: 'ep4', source: 'p4', target: 'p5' },
        { id: 'ep5', source: 'p5', target: 'p6' },
        { id: 'ep6', source: 'p6', target: 'p7', label: 'Success' },
        { id: 'ep7', source: 'p6', target: 'p8', label: 'Failure' },
        { id: 'ep8', source: 'p8', target: 'p5', animated: true },
      ],
    },
  },
];

export const MOCK_SUGGESTIONS: Suggestion[] = [
  { id: 'sug-1', type: 'feature', title: 'Wishlist / Save for Later', description: 'Allow users to save products to a wishlist before purchasing.', rationale: 'Reduces cart abandonment and increases return visits.', affectedModule: 'Product Catalog', priority: 'high', status: 'pending' },
  { id: 'sug-2', type: 'edge_case', title: 'Out of Stock Handling', description: 'Show "Notify Me" option when a product variant is out of stock.', rationale: 'Prevents lost sales and captures demand signals.', affectedModule: 'Product Catalog', priority: 'high', status: 'pending' },
  { id: 'sug-3', type: 'flow', title: 'Guest Checkout Flow', description: 'Allow users to checkout without creating an account.', rationale: 'Reduces friction for first-time buyers significantly.', affectedModule: 'Cart & Checkout', priority: 'high', status: 'pending' },
  { id: 'sug-4', type: 'edge_case', title: 'Session Expiry During Checkout', description: 'Handle expired sessions mid-checkout gracefully (save progress, prompt re-login).', rationale: 'Prevents cart loss due to session timeouts.', affectedModule: 'Cart & Checkout', priority: 'medium', status: 'pending' },
  { id: 'sug-5', type: 'feature', title: 'Product Reviews & Ratings', description: 'Allow verified purchasers to submit star ratings and text reviews.', rationale: 'Social proof significantly increases conversion rates.', affectedModule: 'Product Catalog', priority: 'medium', status: 'pending' },
  { id: 'sug-6', type: 'module', title: 'Admin Analytics Dashboard', description: 'Add a dedicated analytics module showing sales, GMV, top products, conversion funnel.', rationale: 'Business intelligence is critical for growth decisions.', priority: 'medium', status: 'pending' },
];

export const MOCK_STORIES: Story[] = [
  {
    id: 'story-001', moduleId: 'mod-auth', featureId: 'feat-auth-1', workflowId: 'wf-001',
    title: 'User Registration with Email',
    asA: 'new visitor', iWant: 'to register using my email and password', soThat: 'I can access personalised features and track my orders',
    acceptanceCriteria: [
      'Given I am on the registration page, When I fill in name, email, and password and click Sign Up, Then my account is created and I receive a verification email',
      'Given I enter an already registered email, When I submit, Then I see an error "Email already in use"',
      'Given I enter a password shorter than 8 characters, When I submit, Then I see a validation error',
    ],
    edgeCases: ['Network timeout during submission', 'Email service unavailable', 'Disposable email addresses'],
    dependencies: [],
    priority: 'high', storyPoints: 5, isFinalized: false,
  },
  {
    id: 'story-002', moduleId: 'mod-auth', featureId: 'feat-auth-2', workflowId: 'wf-001',
    title: 'User Login with Email & Password',
    asA: 'registered user', iWant: 'to log in with my email and password', soThat: 'I can access my account and continue shopping',
    acceptanceCriteria: [
      'Given I am on the login page, When I enter valid credentials, Then I am redirected to my dashboard',
      'Given I enter wrong credentials, When I submit, Then I see "Invalid email or password"',
      'Given I fail login 5 times, When I attempt again, Then I am locked out for 15 minutes',
    ],
    edgeCases: ['Account not verified', 'Account suspended', 'SQL injection in fields'],
    dependencies: ['story-001'],
    priority: 'high', storyPoints: 3, isFinalized: false,
  },
  {
    id: 'story-003', moduleId: 'mod-catalog', featureId: 'feat-cat-1', workflowId: 'wf-002',
    title: 'Browse Product Listing with Filters',
    asA: 'shopper', iWant: 'to browse products with filters and sorting', soThat: 'I can quickly find products that match my needs',
    acceptanceCriteria: [
      'Given I open the catalog page, When I select a category filter, Then only products in that category are shown',
      'Given I set a price range, When I apply, Then products outside the range are hidden',
      'Given I sort by "Price: Low to High", When the list updates, Then products appear in ascending price order',
    ],
    edgeCases: ['No products match filters (empty state)', 'Filter combination returns 0 results', 'Very long product names in cards'],
    dependencies: [],
    priority: 'high', storyPoints: 5, isFinalized: false,
  },
  {
    id: 'story-004', moduleId: 'mod-catalog', featureId: 'feat-cat-2', workflowId: 'wf-002',
    title: 'View Product Detail Page',
    asA: 'shopper', iWant: 'to view a detailed product page with images and variants', soThat: 'I can make an informed purchase decision',
    acceptanceCriteria: [
      'Given I click on a product card, When the detail page loads, Then I see images, description, price, and available variants',
      'Given I select a size variant, When the selection is made, Then the stock status updates for that variant',
      'Given a product is out of stock, When I view it, Then I see a "Notify Me" button instead of "Add to Cart"',
    ],
    edgeCases: ['Product deleted between list view and detail view', 'Image load failure', 'No variants available'],
    dependencies: ['story-003'],
    priority: 'high', storyPoints: 5, isFinalized: false,
  },
  {
    id: 'story-005', moduleId: 'mod-cart', featureId: 'feat-cart-1', workflowId: 'wf-002',
    title: 'Add Items to Shopping Cart',
    asA: 'shopper', iWant: 'to add products to my cart', soThat: 'I can purchase multiple items in one transaction',
    acceptanceCriteria: [
      'Given I am on a product detail page, When I click "Add to Cart", Then the item appears in my cart sidebar',
      'Given an item is already in my cart, When I add it again, Then the quantity increments',
      'Given I am not logged in, When I add to cart, Then the cart persists for the session and merges on login',
    ],
    edgeCases: ['Item goes out of stock after being added', 'Maximum cart size limit reached', 'Price changes after item in cart'],
    dependencies: ['story-004'],
    priority: 'high', storyPoints: 3, isFinalized: false,
  },
  {
    id: 'story-006', moduleId: 'mod-cart', featureId: 'feat-cart-2', workflowId: 'wf-002',
    title: 'Complete Checkout Flow',
    asA: 'shopper', iWant: 'to complete a purchase through a guided checkout', soThat: 'I can buy the items in my cart securely',
    acceptanceCriteria: [
      'Given I have items in my cart, When I click Checkout, Then I see a multi-step flow: Address → Shipping → Payment → Review',
      'Given I enter a valid address, When I proceed, Then shipping options are calculated and displayed',
      'Given payment succeeds, When I reach confirmation, Then I receive an order confirmation email',
    ],
    edgeCases: ['Payment gateway timeout', 'Address validation failure', 'Shipping unavailable to selected region'],
    dependencies: ['story-005', 'story-002'],
    priority: 'high', storyPoints: 8, isFinalized: false,
  },
  {
    id: 'story-007', moduleId: 'mod-orders', featureId: 'feat-ord-1', workflowId: 'wf-002',
    title: 'Track Order Status',
    asA: 'customer', iWant: 'to track my order in real-time', soThat: 'I know when to expect my delivery',
    acceptanceCriteria: [
      'Given my order is confirmed, When I open Order Tracking, Then I see a status timeline with current position',
      'Given the order status changes, When I am on the tracking page, Then the UI updates automatically',
      'Given the order is out for delivery, When I check tracking, Then I see an estimated delivery time',
    ],
    edgeCases: ['Carrier API unavailable', 'Order cancelled mid-transit', 'Multiple packages in one order'],
    dependencies: ['story-006'],
    priority: 'high', storyPoints: 5, isFinalized: false,
  },
  {
    id: 'story-008', moduleId: 'mod-orders', featureId: 'feat-ord-3', workflowId: 'wf-002',
    title: 'Initiate Product Return',
    asA: 'customer', iWant: 'to return a product within the return window', soThat: 'I can get a refund if the product does not meet expectations',
    acceptanceCriteria: [
      'Given my order is delivered, When I click "Return Item", Then I see return options and reason selection',
      'Given I submit a return request, When it is approved, Then I receive a return shipping label via email',
      'Given the return window has passed, When I try to initiate return, Then I see "Return period expired"',
    ],
    edgeCases: ['Partial return (multiple items)', 'Refund method unavailable', 'Item condition disputed'],
    dependencies: ['story-007'],
    priority: 'medium', storyPoints: 5, isFinalized: false,
  },
];

export const MOCK_SUBTASKS: SubTask[] = [
  // story-001 subtasks
  { id: 'st-001-be-1', storyId: 'story-001', type: 'backend', title: 'POST /auth/register endpoint', description: 'Create registration API with input validation, password hashing (bcrypt), and duplicate email check.' },
  { id: 'st-001-be-2', storyId: 'story-001', type: 'backend', title: 'Email verification service', description: 'Generate secure token, store with expiry, send verification email via SMTP.' },
  { id: 'st-001-fe-1', storyId: 'story-001', type: 'frontend', title: 'Registration form component', description: 'Build form with name, email, password fields. Client-side validation, error display, loading state.' },
  { id: 'st-001-qa-1', storyId: 'story-001', type: 'qa', title: 'Registration test scenarios', description: 'Test happy path, duplicate email, weak password, network failure, email not received.' },

  // story-006 subtasks
  { id: 'st-006-be-1', storyId: 'story-006', type: 'backend', title: 'POST /orders endpoint', description: 'Create order from cart, validate stock, calculate totals, initiate payment.' },
  { id: 'st-006-be-2', storyId: 'story-006', type: 'backend', title: 'Payment gateway integration', description: 'Integrate Stripe/Razorpay SDK, handle webhooks for payment confirmation/failure.' },
  { id: 'st-006-fe-1', storyId: 'story-006', type: 'frontend', title: 'Multi-step checkout stepper', description: 'Build 4-step wizard: Address → Shipping → Payment → Review with progress indicator.' },
  { id: 'st-006-fe-2', storyId: 'story-006', type: 'frontend', title: 'Payment form with card validation', description: 'Credit card form with Luhn validation, CVV masking, and saved card support.' },
  { id: 'st-006-qa-1', storyId: 'story-006', type: 'qa', title: 'Checkout E2E test suite', description: 'Automate full checkout flow, payment failure retry, session expiry mid-checkout.' },
];

export const MOCK_STREAM_TEXTS = {
  consolidation: `Analyzing your product documentation...

The E-Commerce Platform is a comprehensive online shopping solution built to serve both end-consumers and business administrators. The platform encompasses four primary modules:

**Authentication & User Management** handles the complete user lifecycle — from registration (email/OAuth) to role-based access control for customers and admins. Security is paramount with JWT token management and multi-device session support.

**Product Catalog** is the discovery engine — featuring an intelligent search with autocomplete, faceted filtering by category/price/brand, and rich product detail pages with image galleries, variant selection (size, color), and stock management.

**Cart & Checkout** manages the purchase journey. The cart supports guest sessions with merge-on-login, coupon application, and real-time stock validation. The checkout is a multi-step guided flow: address selection → shipping method → payment processing → order review, with integration to payment gateways.

**Order Management** closes the loop post-purchase with real-time tracking via carrier API integration, order history with reorder capability, and a self-service returns workflow within the policy window.

Key UI patterns identified: persistent top navigation with search, breadcrumb navigation for catalog depth, a slide-out cart sidebar, and a bottom summary bar during checkout.`,

  workflows: `Generating user journeys and decision flows...

Workflow 1: **User Registration & Onboarding**
The user arrives on the homepage, clicks Sign Up, and chooses between email registration or OAuth. Email path requires form completion and email verification. OAuth path redirects to the provider and returns authenticated. Both paths converge at account creation.

Workflow 2: **Product Discovery & Purchase**
Starting from the catalog, the user applies search/filter to narrow results, views a product detail page, selects variants, and adds to cart. Checkout is initiated from the cart — the payment gateway determines success (order confirmed) or failure (retry loop).

Workflow 3: **Order Tracking & Return**
Post-purchase, users access Order History, select an order to view real-time tracking status. Within the return window, they can initiate a return, select a reason, and receive a shipping label. Refund is processed on item receipt.`,

  suggestions: `Analyzing approved product structure for gaps and improvements...

Reviewing the four modules against industry best practices for e-commerce platforms, I've identified the following opportunities:

1. **Wishlist / Save for Later** — Currently missing. Users often discover products they want later. A wishlist reduces cart abandonment and increases return engagement.

2. **Out of Stock Handling** — The catalog module doesn't address what happens when variants are unavailable. A "Notify Me" flow captures demand and prevents lost sales.

3. **Guest Checkout Flow** — Requiring account creation before purchase is a major friction point. Guest checkout significantly improves conversion for first-time buyers.

4. **Session Expiry During Checkout** — A common edge case that's not covered. Users mid-checkout who get logged out lose their cart progress. This needs graceful handling.

5. **Product Reviews & Ratings** — Social proof is a top conversion driver in e-commerce. Verified purchaser reviews should be part of the product detail page.

6. **Admin Analytics Dashboard** — Business intelligence tools for tracking GMV, conversion funnel, top products, and customer metrics are essential for growth.`,

  stories: `Generating user stories from approved workflows and modules...

Analyzing 4 modules, 12 features, and 2 approved workflows. Mapping acceptance criteria to each workflow step and feature requirement...

Creating stories for Authentication & User Management...
  ✓ User Registration with Email
  ✓ User Login with Email & Password
  ✓ OAuth Login (Google)
  ✓ Password Reset Flow

Creating stories for Product Catalog...
  ✓ Browse Product Listing with Filters
  ✓ View Product Detail Page
  ✓ Search Products with Autocomplete
  ✓ View Product Reviews

Creating stories for Cart & Checkout...
  ✓ Add Items to Shopping Cart
  ✓ Apply Coupon Code
  ✓ Complete Checkout Flow
  ✓ Guest Checkout

Creating stories for Order Management...
  ✓ Track Order Status
  ✓ View Order History
  ✓ Initiate Product Return

All stories generated with acceptance criteria, edge cases, and dependencies mapped.`,

  subtasks: `Decomposing story into Backend, Frontend, and QA tasks...

Analyzing acceptance criteria and technical requirements...

Backend tasks:
  ✓ API endpoint design and implementation
  ✓ Database schema and migrations
  ✓ Business logic and validation
  ✓ Third-party integrations

Frontend tasks:
  ✓ UI component implementation
  ✓ State management and API integration
  ✓ Form validation and error handling
  ✓ Responsive design

QA tasks:
  ✓ Happy path test scenarios
  ✓ Edge case coverage
  ✓ Integration test planning
  ✓ Regression considerations`,
};
