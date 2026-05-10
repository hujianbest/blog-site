#!/usr/bin/env python3
"""
Generate HTML closeout report from closeout markdown and verification records.
Pure Python stdlib - no external dependencies.
"""

import os
import sys
import re
from datetime import datetime
from pathlib import Path
from html import escape

def read_file(filepath):
    """Read file content, return None if not exists."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return f.read()
    except Exception:
        return None

def parse_markdown_headers(content):
    """Parse markdown headers to extract sections."""
    sections = {}
    current_section = None
    current_content = []

    for line in content.split('\n'):
        if line.startswith('## '):
            if current_section:
                sections[current_section] = '\n'.join(current_content)
            current_section = line[3:].strip()
            current_content = []
        elif line.startswith('### '):
            if current_section:
                sections[current_section] = '\n'.join(current_content)
            current_section = line[4:].strip()
            current_content = []
        else:
            current_content.append(line)

    if current_section:
        sections[current_section] = '\n'.join(current_content)

    return sections

def parse_markdown_table(content):
    """Parse markdown table to list of dicts."""
    lines = content.strip().split('\n')
    if len(lines) < 2:
        return []

    # Parse header
    headers = [h.strip() for h in lines[0].split('|')[1:-1]]
    rows = []

    # Skip separator line (line 1)
    for line in lines[2:]:
        if line.strip():
            values = [v.strip() for v in line.split('|')[1:-1]]
            row = dict(zip(headers, values))
            rows.append(row)

    return rows

def markdown_to_html(text):
    """Simple markdown to HTML conversion."""
    if not text:
        return ''

    html = text

    # Headers
    html = re.sub(r'^### (.*?)$', r'<h3>\1</h3>', html, flags=re.MULTILINE)
    html = re.sub(r'^## (.*?)$', r'<h2>\1</h2>', html, flags=re.MULTILINE)

    # Bold
    html = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', html)

    # Italic
    html = re.sub(r'\*(.*?)\*', r'<em>\1</em>', html)

    # Code
    html = re.sub(r'`(.*?)`', r'<code>\1</code>', html)

    # Links
    html = re.sub(r'\[([^\]]+)\]\(([^\)]+)\)', r'<a href="\2">\1</a>', html)

    # Lists
    html = re.sub(r'^- (.*?)$', r'<li>\1</li>', html, flags=re.MULTILINE)

    # Checkboxes
    html = re.sub(r'- \[x\] (.*?)$', r'<li><input type="checkbox" checked disabled> \1</li>', html, flags=re.MULTILINE)
    html = re.sub(r'- \[ \] (.*?)$', r'<li><input type="checkbox" disabled> \1</li>', html, flags=re.MULTILINE)

    # Line breaks
    html = html.replace('\n\n', '</p><p>')
    html = '<p>' + html + '</p>'

    # Clean up empty paragraphs
    html = html.replace('<p></p>', '')

    return html

def extract_coverage_from_verification(feature_dir):
    """Extract test coverage from verification records."""
    verification_dir = Path(feature_dir) / 'verification'
    coverage_info = {
        'lines': None,
        'branches': None,
        'functions': None,
        'statements': None
    }

    if not verification_dir.exists():
        return coverage_info

    # Try to read coverage.json first
    coverage_json = verification_dir / 'coverage.json'
    if coverage_json.exists():
        content = read_file(coverage_json)
        if content:
            try:
                import json
                data = json.loads(content)
                total = data.get('total', {})
                coverage_info['lines'] = total.get('lines', {}).get('pct')
                coverage_info['branches'] = total.get('branches', {}).get('pct')
                coverage_info['functions'] = total.get('functions', {}).get('pct')
                coverage_info['statements'] = total.get('statements', {}).get('pct')
                return coverage_info
            except Exception:
                pass

    # Fallback: scan verification md files for coverage patterns
    for md_file in verification_dir.glob('*.md'):
        content = read_file(md_file)
        if not content:
            continue

        # Look for patterns like "Lines: 92.5%" or istanbul tables
        lines_match = re.search(r'Lines:\s*([\d.]+)%', content)
        if lines_match and not coverage_info['lines']:
            coverage_info['lines'] = float(lines_match.group(1))

        branches_match = re.search(r'Branches:\s*([\d.]+)%', content)
        if branches_match and not coverage_info['branches']:
            coverage_info['branches'] = float(branches_match.group(1))

        functions_match = re.search(r'Functions:\s*([\d.]+)%', content)
        if functions_match and not coverage_info['functions']:
            coverage_info['functions'] = float(functions_match.group(1))

    return coverage_info

def generate_html_report(feature_dir):
    """Generate HTML closeout report."""
    feature_path = Path(feature_dir)
    closeout_md = feature_path / 'closeout.md'

    if not closeout_md.exists():
        print(f"Error: {closeout_md} not found", file=sys.stderr)
        return False

    # Read closeout markdown
    closeout_content = read_file(closeout_md)
    if not closeout_content:
        print(f"Error: Cannot read {closeout_md}", file=sys.stderr)
        return False

    # Parse closeout sections
    sections = parse_markdown_headers(closeout_content)

    # Extract metadata
    metadata = {}
    for line in closeout_content.split('\n')[:50]:
        if line.startswith('**Closeout Date**'):
            metadata['date'] = line.split(':', 1)[1].strip()
        elif line.startswith('**Closeout Type**'):
            metadata['type'] = line.split(':', 1)[1].strip()
        elif line.startswith('**Task**'):
            metadata['task'] = line.split(':', 1)[1].strip()
        elif line.startswith('**Feature**'):
            metadata['feature'] = line.split(':', 1)[1].strip()

    # Extract coverage
    coverage = extract_coverage_from_verification(feature_dir)

    # Parse evidence matrix table
    evidence_matrix = []
    evidence_section = sections.get('Evidence Matrix', '')
    if evidence_section:
        evidence_matrix = parse_markdown_table(evidence_section)

    # Parse verification checklist
    checklist = []
    checklist_section = sections.get('Verification Checklist', '')
    if checklist_section:
        for match in re.finditer(r'- \[([ x])\] \*\*(.*?)\*\*', checklist_section):
            checked = match.group(1) == 'x'
            item = match.group(2)
            checklist.append({'item': item, 'checked': checked})

    # Generate HTML
    html = f"""<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Closeout Report - {escape(metadata.get('task', 'Unknown'))}</title>
    <style>
        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}

        body {{
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #f5f5f5;
            padding: 20px;
        }}

        .container {{
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            overflow: hidden;
        }}

        .header {{
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
        }}

        .header h1 {{
            font-size: 28px;
            margin-bottom: 10px;
        }}

        .header .metadata {{
            font-size: 14px;
            opacity: 0.9;
        }}

        .badge {{
            display: inline-block;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
            margin-right: 8px;
        }}

        .badge-success {{
            background: #10b981;
            color: white;
        }}

        .badge-warning {{
            background: #f59e0b;
            color: white;
        }}

        .badge-info {{
            background: #3b82f6;
            color: white;
        }}

        .section {{
            padding: 30px;
            border-bottom: 1px solid #e5e7eb;
        }}

        .section:last-child {{
            border-bottom: none;
        }}

        .section h2 {{
            font-size: 20px;
            margin-bottom: 20px;
            color: #1f2937;
            border-bottom: 2px solid #667eea;
            padding-bottom: 10px;
        }}

        .summary-grid {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 20px;
        }}

        .summary-card {{
            background: #f9fafb;
            padding: 20px;
            border-radius: 6px;
            border-left: 4px solid #667eea;
        }}

        .summary-card h3 {{
            font-size: 14px;
            color: #6b7280;
            margin-bottom: 8px;
            text-transform: uppercase;
        }}

        .summary-card .value {{
            font-size: 24px;
            font-weight: 700;
            color: #1f2937;
        }}

        table {{
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }}

        th, td {{
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #e5e7eb;
        }}

        th {{
            background: #f9fafb;
            font-weight: 600;
            color: #374151;
        }}

        tr:hover {{
            background: #f9fafb;
        }}

        .status-pass {{
            color: #10b981;
            font-weight: 600;
        }}

        .status-fail {{
            color: #ef4444;
            font-weight: 600;
        }}

        .checklist {{
            list-style: none;
        }}

        .checklist li {{
            padding: 8px 0;
            border-bottom: 1px solid #e5e7eb;
        }}

        .checklist li input {{
            margin-right: 10px;
        }}

        .coverage-grid {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 15px;
        }}

        .coverage-card {{
            background: #f9fafb;
            padding: 15px;
            border-radius: 6px;
            text-align: center;
        }}

        .coverage-card .label {{
            font-size: 12px;
            color: #6b7280;
            margin-bottom: 5px;
        }}

        .coverage-card .value {{
            font-size: 20px;
            font-weight: 700;
            color: #1f2937;
        }}

        .footer {{
            background: #f9fafb;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #6b7280;
        }}

        @media (max-width: 768px) {{
            .summary-grid {{
                grid-template-columns: 1fr;
            }}

            .section {{
                padding: 20px;
            }}
        }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>{escape(metadata.get('task', 'Closeout Report'))}</h1>
            <div class="metadata">
                <span class="badge badge-info">{escape(metadata.get('feature', 'Unknown Feature'))}</span>
                <span class="badge badge-success">{escape(metadata.get('type', 'task-closeout'))}</span>
                <span>{escape(metadata.get('date', datetime.now().strftime('%Y-%m-%d')))}</span>
            </div>
        </div>

        <div class="section">
            <h2>Closeout Summary</h2>
            <div class="summary-grid">
"""

    # Add conclusion and key metrics
    conclusion = sections.get('Closeout Summary', '')
    conclusion_match = re.search(r'\*\*Conclusion\*\*:\s*(.+)', conclusion)
    if conclusion_match:
        html += f"""
                <div class="summary-card">
                    <h3>Conclusion</h3>
                    <div class="value">{escape(conclusion_match.group(1).strip())}</div>
                </div>
"""

    # Add coverage section if data available
    if any(v is not None for v in coverage.values()):
        html += """
            </div>
        </div>

        <div class="section">
            <h2>Test Coverage</h2>
            <div class="coverage-grid">
"""
        if coverage['lines'] is not None:
            html += f"""
                <div class="coverage-card">
                    <div class="label">Lines</div>
                    <div class="value">{coverage['lines']:.1f}%</div>
                </div>
"""
        if coverage['branches'] is not None:
            html += f"""
                <div class="coverage-card">
                    <div class="label">Branches</div>
                    <div class="value">{coverage['branches']:.1f}%</div>
                </div>
"""
        if coverage['functions'] is not None:
            html += f"""
                <div class="coverage-card">
                    <div class="label">Functions</div>
                    <div class="value">{coverage['functions']:.1f}%</div>
                </div>
"""
        if coverage['statements'] is not None:
            html += f"""
                <div class="coverage-card">
                    <div class="label">Statements</div>
                    <div class="value">{coverage['statements']:.1f}%</div>
                </div>
"""

        if not any(v is not None for v in coverage.values()):
            html += """
                <p>未提供覆盖率数据</p>
"""

    # Add evidence matrix table
    if evidence_matrix:
        html += """
            </div>
        </div>

        <div class="section">
            <h2>Evidence Matrix</h2>
            <table>
                <thead>
                    <tr>
                        <th>Artifact</th>
                        <th>Record Path</th>
                        <th>Status</th>
                        <th>Profile</th>
                    </tr>
                </thead>
                <tbody>
"""
        for row in evidence_matrix:
            status_class = 'status-pass' if '✅' in row.get('Status', '') else 'status-fail'
            html += f"""
                    <tr>
                        <td>{escape(row.get('Artifact', ''))}</td>
                        <td><code>{escape(row.get('Record Path', ''))}</code></td>
                        <td class="{status_class}">{escape(row.get('Status', ''))}</td>
                        <td>{escape(row.get('Profile', ''))}</td>
                    </tr>
"""
        html += """
                </tbody>
            </table>
        """

    # Add verification checklist
    if checklist:
        html += """
        </div>

        <div class="section">
            <h2>Verification Checklist</h2>
            <ul class="checklist">
"""
        for item in checklist:
            checked_attr = 'checked' if item['checked'] else ''
            html += f"""
                <li>
                    <input type="checkbox" {checked_attr} disabled>
                    {escape(item['item'])}
                </li>
"""
        html += """
            </ul>
        """

    # Add completion summary
    completion_summary = sections.get('Completion Summary', '')
    if completion_summary:
        html += f"""
        </div>

        <div class="section">
            <h2>Completion Summary</h2>
            {markdown_to_html(completion_summary)}
        """

    html += f"""
        </div>

        <div class="footer">
            Generated by HarnessFlow HF-Finalize | {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
        </div>
    </div>
</body>
</html>
"""

    # Write HTML file
    output_path = feature_path / 'closeout.html'
    try:
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(html)
        print(f"✅ Generated: {output_path}")
        return True
    except Exception as e:
        print(f"❌ Error writing HTML: {e}", file=sys.stderr)
        return False

def main():
    if len(sys.argv) < 2:
        print("Usage: python render-closeout-html.py <feature-dir>", file=sys.stderr)
        print("Example: python render-closeout-html.py features/001-personal-writing-platform/", file=sys.stderr)
        sys.exit(1)

    feature_dir = sys.argv[1]
    if not os.path.isdir(feature_dir):
        print(f"Error: {feature_dir} is not a directory", file=sys.stderr)
        sys.exit(1)

    success = generate_html_report(feature_dir)
    sys.exit(0 if success else 1)

if __name__ == '__main__':
    main()
